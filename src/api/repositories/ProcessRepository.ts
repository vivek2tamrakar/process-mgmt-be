import { EntityRepository, Repository } from "typeorm";
import { ProcessModel } from "../models/ProcessModel";
import { UserRolesId } from "../enums/Users";

@EntityRepository(ProcessModel)
export class ProcessRepository extends Repository<ProcessModel> {

    public async getProcessList(userId: number, roleId: number): Promise<ProcessModel[]> {
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
        if (roleId == UserRolesId.COMPANYID || roleId==UserRolesId.TASKMANAGERID)
            qb.andWhere('process.user_id =:userId', { userId: userId })
        else
            qb.andWhere('assign.assign_user_id=:assignUserId', { assignUserId: userId });

        return qb.getMany()
    }

    public async processDataById(processId: number): Promise<ProcessModel> {
        const qb = await this.createQueryBuilder('process')
            .select([
                'process.id', 'process.name', 'process.groupId', 'process.folderId', 'process.tags',
                'process.description', 'process.createdAt', 'process.updatedAt', 'process.tags', 'process.description',
                'step.id', 'step.stepDescription'
            ])
            .leftJoin('process.step', 'step')
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

}