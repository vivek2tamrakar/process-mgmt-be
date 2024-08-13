import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { AssignRepository } from "../repositories/AssignRepository";
import { AssignModel } from "../models/AssignModel";
import { assignMail } from "../../mailers/userMailer";
import { UserService } from "./UserService";
import { ProcessService } from "./ProcessService";
import { FolderService } from "./FolderService";
import { GroupService } from "./GroupService";

@Service()
export class AssignService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @Service() private userService: UserService,
        @Service() private processService: ProcessService,
        @Service() private folderService: FolderService,
        @Service() private groupServicea: GroupService,
        @OrmRepository() private assignRepository: AssignRepository,
    ) { }

    /* ------------------ assign user by the company------------------ */
    public async assignGroup(body: any): Promise<AssignModel> {
        this.log.info(`assign user  ${body}`)
        return await this.assignRepository.save(body);
    }

    /* ------------------ edit members user by the company------------------ */
    public async editMembers(body: any): Promise<AssignModel> {
        this.log.info(`edit members  ${body}`)
        let key = body.groupId ? 'groupId' : body.folderId ? 'folderId' : 'processId';
        const value = body[key];
        const existingRecord = await this.assignRepository.find({ [key]: value });
        if (existingRecord?.length)
            await this.assignRepository.delete({ [key]: value });
        const newAssignments = body?.assignUserId?.map((ele) => ({
            assignUserId: ele,
            [key]: value,
            userId: body?.userId ? body?.userId : 0,
            sendMail: this.sendMail(ele, key, value)
        }));
        return await this.assignRepository.save(newAssignments);
    }

    public async sendMail(userId: number, key: string, value: number): Promise<AssignModel | any> {
        const userData = await this.userService.getUserData(userId);
        let assignData;
        if (key == 'groupId') {
            assignData = await this.groupServicea.getGroupDataById(value)
            console.log()
            assignData.key = 'group'
        } else if (key == 'folderId') {
            assignData = await this.folderService.getFolderDataById(value);
            assignData.key = 'folder'
        } else {
            assignData = await this.processService.processData(value)
            assignData.key = 'process'
        }
        await assignMail(userData?.email, assignData)
    }

    /* ------------------ get user's of particular group------------------ */
    public async getUserOfParticularGroup(groupId: number): Promise<AssignModel[]> {
        this.log.info(`get user's of particular group`)
        return await this.assignRepository.getUserOfParticularGroup(groupId);
    }


    /* ------------------ get group list whose assign to this user------------------ */
    public async groupList(assignUserId): Promise<AssignModel[]> {
        this.log.info(`get group list whose assign to this user`)
        return await this.assignRepository.groupList(assignUserId);
    }

    /* ------------------ get process list whose assign to this user------------------ */
    public async processList(assignUserId): Promise<AssignModel[]> {
        this.log.info(`get group list whose assign to this user`)
        return await this.assignRepository.processList(assignUserId);
    }

}