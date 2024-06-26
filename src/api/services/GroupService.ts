import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { GroupRepository } from "../repositories/GroupRepository";
import { GroupModel } from "../models/GroupModel";
import { LoggerInterface } from "../../lib/logger";
import { Logger } from "../../decorators/Logger";
import { GroupError, NotFound } from "../errors/Group";
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

    /* ---------------------- assign groups user ------------ */
    public async assignGroupsUser(groupId: number): Promise<GroupModel> {
        this.log.info(`get group list`)
        return await this.groupRepository.assignGroupsUser(groupId)
    }

    /* ---------------------- edit group -------------------- */
    public async editGroupFolderProcess(body: any): Promise<GroupModel | any> {
        this.log.info(`edit group ,folder,process`)
        // if (body?.groupId) {
        //     const isGroupExist = await this.groupRepository.findOne({ id: body?.groupId });
        //     if (isGroupExist) {
        //         isGroupExist.name = body?.name;
        //         return await this.groupRepository.save(isGroupExist);
        //     }
        // } else if (body?.folderId) {
        //     const isFolderExist = await this.folderRepository.findOne({ id: body?.folderId });
        //     if (isFolderExist) {
        //         isFolderExist.name = body?.name;
        //         return await this.folderRepository.save(isFolderExist);
        //     }
        // } else if (body?.processId) {
        //     const isProcessExist = await this.processRepository.findOne({ id: body?.processId });
        //     if (isProcessExist) {
        //         isProcessExist.name = body?.name;
        //         return await this.processRepository.save(isProcessExist);
        //     }
        // }
        // throw new NotFound()

        if (body?.groupId) {
            const updatedGroup = await this.updateEntity(this.groupRepository, body?.groupId, body?.name);
            if (updatedGroup) return updatedGroup;
        } else if (body?.folderId) {
            const updatedFolder = await this.updateEntity(this.folderRepository, body?.folderId, body?.name);
            if (updatedFolder) return updatedFolder;
        } else if (body?.processId) {
            const updatedProcess = await this.updateEntity(this.processRepository, body?.processId, body?.name);
            if (updatedProcess) return updatedProcess;
        }
        throw new NotFound();
    }

    public async updateEntity(repository: any, id: number, name: string) {
        const entity = await repository.findOne({ id: id });
        if (entity) {
            entity.name = name;
            return await repository.save(entity);
        }
        return null;
    }

    /* ---------------------- delete group ------------ */
    public async deleteGroup(groupId: number, res: any): Promise<GroupModel> {
        this.log.info(`delete group by ${groupId}`)
        await this.groupRepository.softDelete(groupId)
        return res.status(200).send({ sucess: true, MESSAGE: 'SUCCESSFULLY_DELETE' })
    }

}