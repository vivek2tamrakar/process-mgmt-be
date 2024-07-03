import { EntityRepository, Repository } from "typeorm";
import { GroupModel } from "../models/GroupModel";

@EntityRepository(GroupModel)
export class GroupRepository extends Repository<GroupModel> {

    public async getGroupList(userId: number): Promise<GroupModel[] | any> {
        const qb = await this.createQueryBuilder('group')
            .select([
                'group.id', 'group.name', 'group.createdAt',
                'folder.id', 'folder.name', 'folder.createdAt',
                'process.id', 'process.name', 'process.createdAt', 'process.tags', 'process.description',
                'proces.id', 'proces.name', 'proces.tags', 'proces.description', 'proces.createdAt',
                'assign.id',
                'user.id', 'user.email',
                'step.id', 'step.stepDescription',
                'folderStep.id', 'folderStep.stepDescription'
            ])
            .leftJoin('group.folder', 'folder')
            .leftJoin('folder.process', 'process')
            .leftJoin('group.proces', 'proces')
            .leftJoin('group.assign', 'assign')
            .leftJoin('assign.user', 'user')
            .leftJoin('proces.step', 'step')
            .leftJoin('process.step', 'folderStep')
            .andWhere('group.user_id =:userId', { userId: userId })
        return qb.getMany()
    }

    public async assignGroupsUser(groupId: number): Promise<GroupModel> {
        const qb = await this.createQueryBuilder('group')
            .select([
                'group', 'assign.id',
                'user.id', 'user.email',
                'task.id', 'task.name', 'task.status', 'task.description', 'task.startDate', 'task.endDate', 'task.duration', 'task.createdAt',
                'taskUser.id', 'taskUser.name'
            ])
            .leftJoin('group.assign', 'assign')
            .leftJoin('assign.user', 'user')
            .leftJoin('group.task', 'task')
            .leftJoin('task.user', 'taskUser')
            .andWhere('group.id =:groupId', { groupId: groupId })
        return qb.getOne()
    }

}