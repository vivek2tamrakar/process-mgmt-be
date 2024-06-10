import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { AssignRepository } from "../repositories/AssignRepository";
import { AssignModel } from "../models/AssignModel";

@Service()
export class AssignService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
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
            userId: body?.userId
        }));
        return await this.assignRepository.save(newAssignments);
    }




}