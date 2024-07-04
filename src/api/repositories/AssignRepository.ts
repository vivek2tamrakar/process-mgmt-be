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
}