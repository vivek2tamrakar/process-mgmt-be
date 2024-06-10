import { EntityRepository, Repository } from "typeorm";
import { ProcessModel } from "../models/ProcessModel";

@EntityRepository(ProcessModel)
export class ProcessRepository extends Repository<ProcessModel> {

    public async getProcessList(userId: number): Promise<ProcessModel[]> {
        const qb = await this.createQueryBuilder('process')
            .select(['process.id', 'process.name', 'process.createdAt'])
            .andWhere('process.user_id =:userId', { userId: userId })
            .andWhere('process.group_id IS NULL')
            .andWhere('process.folder_id IS NULL')
        return qb.getMany()
    }

    public async processList(userId: number): Promise<ProcessModel[]> {
        const qb = await this.createQueryBuilder('process')
            .andWhere('process.user_id=:userId', { userId: userId })
            .andWhere('process.group_id IS NULL')
            .andWhere('process.folder_id IS NULL')
        return qb.getMany();
    }

}