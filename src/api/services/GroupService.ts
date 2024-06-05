import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { GroupRepository } from "../repositories/GroupRepository";
import { GroupModel } from "../models/GroupModel";
import { LoggerInterface } from "../../lib/logger";
import { Logger } from "../../decorators/Logger";
import { GroupError } from "../errors/Group";
import { UserRepository } from "../repositories/UserRepository";
import { FolderRepository } from "../repositories/FolderRepository";

@Service()
export class GroupService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private groupRepository: GroupRepository,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private folderRepository: FolderRepository,
    ) { }

    /* ------------------ add group by company------------------ */
    public async addGroup(body: any, id: number): Promise<GroupModel> {
        this.log.info(`add water tracker by user ${body}`)
        let isGroupNameAlreadyExist = await this.groupRepository.findOne({ name: body?.name })
        if (isGroupNameAlreadyExist) throw new GroupError;
        body.userId = id
        return await this.groupRepository.save(body);
    }

    /* ---------------------- group list ------------------ */
    public async getGroup(params: any): Promise<GroupModel[] | any> {
        this.log.info(`get group list`)
        const group = await this.groupRepository.getGroupList(params)
        const user = await this.userRepository.getUserList(params)
        const folder = await this.folderRepository.getFolderList(params)
        return { group, user, folder }
    }
}