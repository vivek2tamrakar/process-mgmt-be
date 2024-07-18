import { EntityRepository, Repository } from "typeorm";
import { ProcessModel } from "../models/ProcessModel";

@EntityRepository(ProcessModel)
export class ProcessRepository extends Repository<ProcessModel> {

    public async getProcessList(userId: number): Promise<ProcessModel[] | any> {
        let assign, created;
        const qb = await this.createQueryBuilder('process')
            .select([
                'process.id', 'process.name', 'process.createdAt', 'process.tags', 'process.description', 'process.updatedAt',
                'step.id', 'step.stepDescription', 'step.isCompleted', 'step.lastReview', 'step.updatedAt',
                'assign.id',
                'user.id', 'user.email',
            ])
            .leftJoin('process.step', 'step')
            .leftJoin('process.assign', 'assign')
            .leftJoin('assign.user', 'user')
            .andWhere('process.group_id IS NULL')
            .andWhere('process.folder_id IS NULL')
        const createdQuery = qb.clone();
        created = await createdQuery.andWhere('process.user_id =:userId', { userId: userId }).getMany();
        const assignQuery = qb.clone();
        assign = await assignQuery.andWhere('assign.assign_user_id=:assignUserId', { assignUserId: userId }).getMany();
        return { created, assign }
    }

    public async processDataById(processId: number): Promise<ProcessModel> {
        const qb = await this.createQueryBuilder('process')
            .select([
                'process.id', 'process.name', 'process.groupId', 'process.folderId', 'process.tags',
                'process.description', 'process.createdAt', 'process.updatedAt', 'process.tags', 'process.description',
                'step.id', 'step.stepDescription',
                'folder.id', 'folder.name',
                'group.id', 'group.name',
                'user.id', 'user.name',
                'comment.id', 'comment.name', 'comment.userId', 'comment.createdAt', 'comment.updatedAt',
                'commentedBy.id', 'commentedBy.name'
            ])
            .leftJoin('process.step', 'step')
            .leftJoin('process.folder', 'folder')
            .leftJoin('process.group', 'group')
            .leftJoin('process.user', 'user')
            .leftJoin('process.comment', 'comment')
            .leftJoin('comment.user', 'commentedBy')
            .andWhere('process.id=:processId', { processId: processId })

        return qb.getOne()
    }

    public async getHomeData(userId: number): Promise<ProcessModel[]> {
        const qb = await this.createQueryBuilder('process')
            .select([
                'process.id', 'process.name', 'process.createdAt', 'process.tags', 'process.description'
            ])
        qb.andWhere('process.user_id =:userId', { userId: userId })
        qb.orderBy('process.created_at', 'DESC')
        return qb.getMany()
    }

    public async searchProcess(userId: number, filter: any): Promise<ProcessModel[] | any> {
        let assign, created;
        const qb = await this.createQueryBuilder('process')
            .select([
                'process.id', 'process.name', 'process.createdAt', 'process.tags', 'process.description', 'process.updatedAt',
                'step.id', 'step.stepDescription', 'step.isCompleted', 'step.lastReview', 'step.updatedAt',
                'assign.id',
                'user.id', 'user.email',
                'comment.id', 'comment.name', 'comment.userId', 'comment.createdAt', 'comment.updatedAt',
                'commentedBy.id', 'commentedBy.name'
            ])
            .leftJoin('process.step', 'step')
            .leftJoin('process.assign', 'assign')
            .leftJoin('assign.user', 'user')
            .leftJoin('process.comment', 'comment')
            .leftJoin('comment.user', 'commentedBy')
            .andWhere('process.group_id IS NULL')
            .andWhere('process.folder_id IS NULL')
        if (filter.tags)
            qb.andWhere(` process.tags LIKE :tags`, { tags: `%${filter.tags}%` });
        const createdQuery = qb.clone();
        created = await createdQuery.andWhere('process.user_id =:userId', { userId: userId }).getMany();
        const assignQuery = qb.clone();
        assign = await assignQuery.andWhere('assign.assign_user_id=:assignUserId', { assignUserId: userId }).getMany();
        return [...created, ...assign]

    }

}