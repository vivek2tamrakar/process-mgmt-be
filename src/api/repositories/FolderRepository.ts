import { EntityRepository, Repository } from "typeorm";
import { FolderModel } from "../models/FolderModel";

@EntityRepository(FolderModel)
export class FolderRepository extends Repository<FolderModel> {

    public async getFolderList(userId: number): Promise<FolderModel[] | any> {
        let assign, created;
        const qb = await this.createQueryBuilder('folder')
            .select([
                'folder.id', 'folder.name', 'folder.createdAt',
                'process.id', 'process.name', 'process.createdAt', 'process.tags', 'process.description', 'process.updatedAt',
                'step.id', 'step.stepDescription', 'step.isCompleted', 'step.lastReview', 'step.updatedAt',
                'assign.id',
                'user.id', 'user.email',
            ])
            .leftJoin('folder.process', 'process')
            .leftJoin('process.step', 'step')
            .leftJoin('folder.assign', 'assign')
            .leftJoin('assign.user', 'user')
            .andWhere('folder.group_id IS NULL')
        const createdQuery = qb.clone();
        created = await createdQuery.andWhere('folder.user_id =:userId', { userId: userId }).getMany();
        const assignQuery = qb.clone();
        assign = await assignQuery.andWhere('assign.assign_user_id=:assignUserId', { assignUserId: userId }).getMany();
        return { created, assign }
    }

    public async folderDataById(id: number): Promise<FolderModel> {
        const qb = await this.createQueryBuilder('folder')
            .select([
                'folder.id', 'folder.name',
                'process.id', 'process.name', 'process.tags', 'process.description', 'process.createdAt', 'process.updatedAt',
                'step.id', 'step.stepDescription', 'step.isCompleted', 'step.lastReview', 'step.updatedAt'
            ])
            .leftJoin('folder.process', 'process')
            .leftJoin('process.step', 'step')
            .andWhere('folder.id=:id', { id: id })
        return qb.getOne()
    }

    public async getHomeData(userId: number): Promise<FolderModel[] | any> {
        const qb = await this.createQueryBuilder('folder')
            .select([
                'folder.id', 'folder.name', 'folder.createdAt',
            ])
        qb.andWhere('folder.user_id =:userId', { userId: userId })
        qb.orderBy('folder.created_at', 'DESC')
        return qb.getMany()
    }

}