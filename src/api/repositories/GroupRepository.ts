import { EntityRepository, Repository } from "typeorm";
import { GroupModel } from "../models/GroupModel";

@EntityRepository(GroupModel)
export class GroupRepository extends Repository<GroupModel> {

    public async getGroupList(userId: number): Promise<GroupModel[] | any> {
        const qb = await this.createQueryBuilder('group')
            .select([
                'group.id', 'group.name', 'group.createdAt',
                'folder.id', 'folder.name', 'folder.createdAt',
                'process.id', 'process.name', 'process.createdAt',
                'proces.id', 'proces.name','process.tags','process.description', 'proces.createdAt',
                'assign.id',
                'user.id', 'user.email',
                'step.id','step.stepDescription'
            ])
            .leftJoin('group.folder', 'folder')
            .leftJoin('folder.process', 'process')
            .leftJoin('group.proces', 'proces')
            .leftJoin('group.assign', 'assign')
            .leftJoin('assign.user', 'user')
            .leftJoin('proces.step','step')
            .andWhere('group.user_id =:userId', { userId: userId })
        return qb.getMany()
    }

    public async assignGroupsUser(groupId: number): Promise<GroupModel> {
        const qb = await this.createQueryBuilder('group')
            .select(['group', 'assign.id', 'user.id', 'user.email'])
            .leftJoin('group.assign', 'assign')
            .leftJoin('assign.user', 'user')
            .andWhere('group.id =:groupId', { groupId: groupId })
        return qb.getOne()
    }

}