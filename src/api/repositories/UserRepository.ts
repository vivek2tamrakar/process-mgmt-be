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
            'users.id', 'users.name', 'users.email', 'users.isActive', 'users.fcmToken', 'users.mobileNumber', 'users.profilePic', 'users.role',
            'task',
            'process.id', 'process.name',
            'group.id', 'group.name',
            'createdByTask.id','createdByTask.name'
        ])
            .leftJoin('users.task', 'task')
            .leftJoin('task.process','process')
            .leftJoin('task.group','group')
            .leftJoin('task.user','createdByTask')
            .andWhere('users.id =:id', { id: userId })
        return qb.getOne()
    }
}