import { EntityRepository, Repository } from "typeorm";
import { GroupModel } from "../models/GroupModel";

@EntityRepository(GroupModel)
export class GroupRepository extends Repository<GroupModel> {

    public async getGroupList(userId: number): Promise<GroupModel[] | any> {
        let assign, created;
        const qb = await this.createQueryBuilder('group')
            .select([
                'group.id', 'group.name', 'group.createdAt',
                'folder.id', 'folder.name', 'folder.createdAt',
                'process.id', 'process.name', 'process.createdAt', 'process.tags', 'process.description', 'process.updatedAt',
                'proces.id', 'proces.name', 'proces.tags', 'proces.description', 'proces.createdAt', 'proces.updatedAt',
                'assign.id',
                'user.id', 'user.email',
                'step.id', 'step.stepDescription', 'step.isCompleted', 'step.createdAt', 'step.lastReview', 'step.updatedAt',
                'folderStep.id', 'folderStep.stepDescription', 'folderStep.isCompleted', 'folderStep.lastReview', 'folderStep.updatedAt', 'folderStep.createdAt'
            ])
            .leftJoin('group.folder', 'folder')
            .leftJoin('folder.process', 'process')
            .leftJoin('group.proces', 'proces')
            .leftJoin('group.assign', 'assign')
            .leftJoin('assign.user', 'user')
            .leftJoin('proces.step', 'step')
            .leftJoin('process.step', 'folderStep')

        const createdQuery = qb.clone();
        created = await createdQuery.andWhere('group.user_id = :userId', { userId: userId }).getMany();
        const assignQuery = qb.clone();
        assign = await assignQuery.andWhere('assign.assign_user_id = :assignUserId', { assignUserId: userId }).getMany();
        return { created, assign }
    }

    public async assignGroupsUser(groupId: number): Promise<GroupModel> {
        const qb = await this.createQueryBuilder('group')
            .select([
                'group', 'assign.id',
                'user.id', 'user.email',
                'task.id', 'task.name', 'task.status', 'task.description', 'task.startDate', 'task.endDate', 'task.duration', 'task.createdAt', 'task.isActive', 'task.isDayTask', 'task.isProcess',
                'taskUser.id', 'taskUser.name'
            ])
            .leftJoin('group.assign', 'assign')
            .leftJoin('assign.user', 'user')
            .leftJoin('group.task', 'task')
            .leftJoin('task.user', 'taskUser')
            .andWhere('group.id =:groupId', { groupId: groupId })
        return qb.getOne()
    }


    public async getHomeData(userId: number): Promise<GroupModel[] | any> {
        const qb = await this.createQueryBuilder('group')
            .select([
                'group.id', 'group.name', 'group.createdAt',
            ])

        qb.andWhere('group.user_id =:userId', { userId: userId });
        qb.orderBy('group.created_at', 'DESC')
        return qb.getMany()
    }

}