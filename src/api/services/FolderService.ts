import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { FolderRepository } from "../repositories/FolderRepository";
import { FolderModel } from "../models/FolderModel";
import { LoggerInterface } from "../../lib/logger";
import { Logger } from "../../decorators/Logger";

@Service()
export class FolderService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private folderRepository: FolderRepository,
    ) { }

    /* --------------------- folder list ------------------*/
    public async folderList(userId: number): Promise<FolderModel[]> {
        this.log.info(`get folder list ${userId}`)
        return await this.folderRepository.folderList(userId);
    }

    /* ------------------ add folder ------------------ */
    public async addFolder(body: any): Promise<FolderModel> {
        this.log.info(`add folder ${body}`)
        return await this.folderRepository.save(body)
    }

    /* ------------------ folder data by id ------------------ */
    public async folderDataById(id: number): Promise<FolderModel> {
        this.log.info(`get folder data by id`)
        return await this.folderRepository.folderDataById(id)
    }


}