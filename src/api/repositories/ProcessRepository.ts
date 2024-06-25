import { EntityRepository, Repository } from "typeorm";
import { ProcessModel } from "../models/ProcessModel";

@EntityRepository(ProcessModel)
export class ProcessRepository extends Repository<ProcessModel> {

    public async getProcessList(userId: number): Promise<ProcessModel[]> {
        const qb = await this.createQueryBuilder('process')
            .select([
                'process.id', 'process.name', 'process.createdAt',
                'step.id','step.step','step.stepDescription'
            ])
            .leftJoin('process.step','step')
            .andWhere('process.user_id =:userId', { userId: userId })
            .andWhere('process.group_id IS NULL')
            .andWhere('process.folder_id IS NULL')
        return qb.getMany()
    }

    public async processDataById(processId: number): Promise<ProcessModel> {
        const qb = await this.createQueryBuilder('process')
            .select([
                'process.id', 'process.name', 'process.groupId', 'process.folderId', 'process.tags',
                'process.description', 'process.createdAt', 'process.updatedAt',
                'step.id', 'step.step', 'step.stepDescription'
            ])
            .leftJoin('process.step', 'step')
            .andWhere('process.id=:processId', { processId: processId })
        return qb.getOne()
    }


}