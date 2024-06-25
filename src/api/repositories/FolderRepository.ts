import { EntityRepository, Repository } from "typeorm";
import { FolderModel } from "../models/FolderModel";

@EntityRepository(FolderModel)
export class FolderRepository extends Repository<FolderModel> {

    public async getFolderList(userId: number): Promise<FolderModel[] | any> {
        const qb = await this.createQueryBuilder('folder')
            .select([
                'folder.id', 'folder.name', 'folder.createdAt',
                'process.id', 'process.name', 'process.createdAt',
                'step.id','step.step','step.stepDescription'
            ])
            .leftJoin('folder.process', 'process')
            .leftJoin('process.step','step')
            .andWhere('folder.user_id =:userId', { userId: userId })
            .andWhere('folder.group_id IS NULL')
        return qb.getMany()
    }

    public async folderDataById(id: number): Promise<FolderModel> {
        const qb = await this.createQueryBuilder('folder')
            .select([
                'folder.id', 'folder.name',
                'process.id', 'process.name',
                'step.id','step.step','step.stepDescription'
            ])
            .leftJoin('folder.process', 'process')
            .leftJoin('process.step','step')
            .andWhere('folder.id=:id', { id: id })
        return qb.getOne()
    }

}