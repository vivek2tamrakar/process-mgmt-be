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
            .andWhere('folder.group_id IS NULL')
        return qb.getMany()
    }

    public async folderList(userId: number): Promise<FolderModel[]> {
        const qb = await this.createQueryBuilder('folder')
            .andWhere('folder.user_id=:userId', { userId: userId })
            .andWhere('folder.group_id IS NULL')
        return qb.getMany();
    }

    public async folderDataById(id: number): Promise<FolderModel> {
        const qb = await this.createQueryBuilder('folder')
            .select([
                'folder.id', 'folder.name',
                'process.id', 'process.name'
            ])
            .leftJoin('folder.process', 'process')
            .andWhere('folder.id=:id', { id: id })
        return qb.getOne()
    }

}