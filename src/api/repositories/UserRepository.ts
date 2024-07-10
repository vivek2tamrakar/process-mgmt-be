import { EntityRepository, Repository } from "typeorm";
import { UserModel } from "../models/UserModel";

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {

    public async companyUserList(companyId: number): Promise<UserModel[]> {
        const qb = await this.createQueryBuilder('users')
            .andWhere('users.created_by_id=:companyId', { companyId: companyId })
        return qb.getMany();
    }

    public async userDetailsById(userId: number): Promise<UserModel> {
        const qb = await this.createQueryBuilder('users')
        .select([
            'users',
            'task',
            
        ])
            .leftJoin('users.task', 'task')
            .andWhere('users.id =:id', { id: userId })
        return qb.getOne()
    }
}