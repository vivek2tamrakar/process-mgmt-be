import { EntityRepository, Repository } from "typeorm";
import { FolderModel } from "../models/FolderModel";

@EntityRepository(FolderModel)
export class FolderRepository extends Repository<FolderModel> {

    public async getFolderList(filter: any): Promise<FolderModel[] | any> {
        const qb = await this.createQueryBuilder('folder')
        return qb.getMany()
    }

}