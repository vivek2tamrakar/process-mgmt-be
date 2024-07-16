import { EntityRepository, getRepository, Repository } from "typeorm";
import { TaskModel } from "../models/TaskModel";
import { Task } from "../enums/task";

@EntityRepository(TaskModel)
export class TaskRepository extends Repository<TaskModel> {

    public async createTaskWithCron(): Promise<TaskModel | any> {
        const date = new Date();
        const dayOfWeek = date.getDay();
        const qb = await this.createQueryBuilder('task')
            .andWhere('task.is_recurren =:isRecurren', { isRecurren: true })
            .andWhere(`(
                DATE_FORMAT(task.recurren_end_date ,'%y-%m-%d') >= DATE_FORMAT(:endDate, '%y-%m-%d')
                OR task.recurren_end_date IS NULL
            )`,
                { endDate: date })

        const yearClone = qb.clone();
        const yearCreateTask = await yearClone.andWhere('task.recurren_type =:yearly', { yearly: Task.YEARLY })
            .andWhere(`DATE_FORMAT(task.recurren_start_date, '%m-%d') =DATE_FORMAT(:startDate,'%m-%d')`, { startDate: date })
            .getMany();

        const monthClone = qb.clone();
        const monthlyCreateTask = await monthClone.andWhere('task.recurren_type =:monthly', { monthly: Task.MONTHLY })
            .andWhere(`DATE_FORMAT(task.recurren_start_date,'%d') >=DATE_FORMAT(:endDate,'%d')`, { endDate: date })
            .getMany();

        const everyDayClone = qb.clone();
        const everyDayCreateTask = await everyDayClone.andWhere('task.recurren_type =:weekly', { weekly: Task.DAILY }).getMany();

        const weeklyClone = qb.clone();
        const WeekDayCreateTask = await weeklyClone.andWhere('task.recurren_type =:weekly', { weekly: Task.WEEKLY })
            .andWhere('DAYOFWEEK(task.recurren_start_date) = :dayOfWeek', { dayOfWeek: dayOfWeek + 1 })
            .getMany();

        const createTask = [...yearCreateTask, ...monthlyCreateTask, ...everyDayCreateTask, ...WeekDayCreateTask];
        const modifyData = createTask?.map((ele) => ({
            groupId: ele?.groupId,
            createdId: ele?.createdId,
            name: ele?.name,
            description: ele?.description,
            userId: ele?.userId,
            processId: ele?.processId,
            status: ele?.status,
            isActive: ele?.isActive,
            startDate: ele?.startDate,
            endDate: ele?.endDate,
            duration: ele?.duration,
            remainder: ele?.remainder,
            isDayTask: ele?.isDayTask,
            isProcess: ele?.isProcess,
            isRecurren: false
        }))
        await getRepository(TaskModel).save(modifyData);
    }


}
