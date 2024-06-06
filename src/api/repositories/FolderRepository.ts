import { EntityRepository, Repository } from "typeorm";
import { FolderModel } from "../models/FolderModel";

@EntityRepository(FolderModel)
export class FolderRepository extends Repository<FolderModel> {

    public async getFolderList(userId: number): Promise<FolderModel[] | any> {
        const qb = await this.createQueryBuilder('folder')
            .select([
                'folder.id', 'folder.name', 'folder.createdAt',
                'process.id', 'process.name', 'process.createdAt',
            ])
            .leftJoin('folder.process', 'process')
            .andWhere('folder.user_id =:userId', { userId: userId })
        return qb.getMany()
    }

    public async folderList(userId: number): Promise<FolderModel[]> {
        const qb = await this.createQueryBuilder('assign')
            .andWhere('assign.user_id=:userId', { userId: userId })
        return qb.getMany();
    }

}