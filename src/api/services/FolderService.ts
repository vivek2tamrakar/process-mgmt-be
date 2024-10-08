import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { FolderRepository } from "../repositories/FolderRepository";
import { FolderModel } from "../models/FolderModel";
import { LoggerInterface } from "../../lib/logger";
import { Logger } from "../../decorators/Logger";
import { FolderAlreadyError } from "../errors/Folder";


@Service()
export class FolderService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private folderRepository: FolderRepository,

    ) { }

    /* ------------------ add folder ------------------ */
    public async addFolder(body: any): Promise<FolderModel> {
        this.log.info(`add folder ${body}`)
        if (body?.groupId)
            return await this.isFolderExist({ name: body?.name, userId: body?.userId, groupId: body.groupId });
        return await this.isFolderExist({ name: body?.name, userId: body?.userId });
    }

    /* -------- to check folder is exist or not -------------*/
    public async isFolderExist(body): Promise<FolderModel> {
        const isFolderExist = await this.folderRepository.findOne(body);
        if (isFolderExist) throw new FolderAlreadyError()
        return await this.folderRepository.save(body);
    }

    /* ------------------ folder data by id ------------------ */
    public async folderDataById(id: number): Promise<FolderModel> {
        this.log.info(`get folder data by id`)
        return await this.folderRepository.folderDataById(id)
    }

    /* ---------------------- delete folder ------------ */
    public async deleteFolder(folderId: number, res: any): Promise<FolderModel> {
        this.log.info(`delete folder ${folderId}`)
        await this.folderRepository.softDelete(folderId)
        return res.status(200).send({ sucess: true, MESSAGE: 'SUCCESSFULLY_DELETE' })
    }

    public async getFolderDataById(folderId: number): Promise<FolderModel> {
        this.log.info(`get folder data by folder id`)
        return await this.folderRepository.findOne(folderId);
    }




}