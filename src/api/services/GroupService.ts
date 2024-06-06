import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { GroupRepository } from "../repositories/GroupRepository";
import { GroupModel } from "../models/GroupModel";
import { LoggerInterface } from "../../lib/logger";
import { Logger } from "../../decorators/Logger";
import { GroupError } from "../errors/Group";
import { FolderRepository } from "../repositories/FolderRepository";
import { ProcessRepository } from "../repositories/ProcessRepository";

@Service()
export class GroupService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private groupRepository: GroupRepository,
        @OrmRepository() private folderRepository: FolderRepository,
        @OrmRepository() private processRepository: ProcessRepository
    ) { }

    /* ------------------ add group by company------------------ */
    public async addGroup(body: any, id: number): Promise<GroupModel> {
        this.log.info(`add water tracker by user ${body}`)
        let isGroupNameAlreadyExist = await this.groupRepository.findOne({ name: body?.name })
        if (isGroupNameAlreadyExist) throw new GroupError;
        body.userId = id;
        return await this.groupRepository.save(body);
    }

    /* ---------------------- group list ------------------ */
    public async getGroup(userId: number): Promise<GroupModel[] | any> {
        this.log.info(`get group list`)
        const group = await this.groupRepository.getGroupList(userId)
        const folder = await this.folderRepository.getFolderList(userId)
        const process = await this.processRepository.getProcessList(userId);
        return { group, folder, process }
    }

    /* ---------------------- group list ------------------ */
    public async groupList(userId: number): Promise<GroupModel[] | any> {
        this.log.info(`get group list`)
        return await this.groupRepository.groupList(userId)
    }

    /* ---------------------- assign groups user ------------ */
    public async assignGroupsUser(groupId: number): Promise<GroupModel> {
        this.log.info(`get group list`)
        return await this.groupRepository.assignGroupsUser(groupId)
    }

}