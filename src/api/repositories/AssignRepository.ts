import { EntityRepository, Repository } from "typeorm";
import { AssignModel } from "../models/AssignModel";

@EntityRepository(AssignModel)
export class AssignRepository extends Repository<AssignModel> {

    public async getUserOfParticularGroup(groupId: number): Promise<AssignModel[]> {
        const qb = await this.createQueryBuilder('assign')
            .select([
                'assign.id',
                'user.id', 'user.email'
            ])
            .leftJoin('assign.user', 'user')
            .andWhere('assign.group_id=:groupId', { groupId: groupId })
        return qb.getMany()
    }

    public async groupList(assignUserId: number): Promise<AssignModel[]> {
        const qb = await this.createQueryBuilder('assign')
            .select([
                'assign.id',
                'group.id', 'group.name'
            ])
            .leftJoin('assign.group', 'group')
            .andWhere('assign.assign_user_id =:assignUserId', { assignUserId: assignUserId })
            .andWhere('assign.group_id IS NOT NULL')
        return qb.getMany()
    }

    public async processList(assignUserId: number): Promise<AssignModel[]> {
        const qb = await this.createQueryBuilder('assign')
            .select([
                'assign.id',
                'process.id', 'process.name'
            ])
            .leftJoin('assign.process', 'process')
            .andWhere('assign.assign_user_id =:assignUserId', { assignUserId: assignUserId })
            .andWhere('assign.process_id IS NOT NULL')
        return qb.getMany()
    }

}