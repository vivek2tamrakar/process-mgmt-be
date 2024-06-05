import { EntityRepository, Repository } from "typeorm";
import { UserModel } from "../models/UserModel";
import { UserRoles } from "../enums/Users";

@EntityRepository(UserModel)
export class UserRepository extends Repository<UserModel> {

    public async getUserList(filter: any): Promise<UserModel[] | any> {
        const qb = await this.createQueryBuilder('users')
            .where('users.role =:role', { role: UserRoles.MANAGER })
            .orWhere('users.role =:roles', { roles: UserRoles.TASKMANAGER })
        return qb.getMany()
    }

    public async companyDataById(companyId: number): Promise<UserModel[]> {
        const qb = await this.createQueryBuilder('users')
            .andWhere('users.created_by_id=:companyId', { companyId: companyId })
        return qb.getMany();
    }

}