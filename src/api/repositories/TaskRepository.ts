import { EntityRepository, Repository } from "typeorm";
import { TaskModel } from "../models/TaskModel";

@EntityRepository(TaskModel)
export class TaskRepository extends Repository<TaskModel> {

    public async taskList(createdId: number): Promise<TaskModel[]> {
        const qb = await this.createQueryBuilder('task')
            .select([
                'task',
                'user.id', 'user.name',
                'process.id', 'process.name',
                'group.id', 'group.name'
            ])
            .leftJoin('task.user', 'user')
            .leftJoin('task.process', 'process')
            .leftJoin('task.group', 'group')
            .andWhere('task.created_id =:createdId', { createdId: createdId })
        return qb.getMany()
    }

}