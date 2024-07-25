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
            .andWhere(`DATE_FORMAT(task.recurren_start_date ,'%y-%m-%d') <= DATE_FORMAT(:date, '%y-%m-%d')`)
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

    public async getTaskByUserId(userId: number, filter: any): Promise<TaskModel[]> {
        const date = new Date();
        const qb = await this.createQueryBuilder('task')
            .select([
                'task',
                'group.id', 'group.name',
                'assignUsers.id', 'assignUsers.email', 'assignUsers.name',
                'process.id', 'process.name', 'process.description', 'process.tags'
            ])
            .leftJoin('task.group', 'group')
            .leftJoin('task.user', 'assignUsers')
            .leftJoin('task.process', 'process')

        if (filter.today == 'true') {
            qb.andWhere(`DATE(task.start_date) = DATE(:today)`, { today: date });
        } else if (filter.weekly == 'true') {
            qb.andWhere(`DATE(task.start_date) >= DATE(:today) AND DATE(task.start_date) <= DATE_ADD(DATE(:today), INTERVAL 7 DAY)`, { today: date });
        } else if (filter.monthly == 'true') {
            qb.andWhere(`DATE(task.start_date) >= DATE(:today) AND DATE(task.start_date) <=DATE_ADD(DATE(:today), INTERVAL 1 MONTH)`, { today: date });
        }

        const createdTaskClone = qb.clone()
        const createTask = await createdTaskClone.andWhere('task.created_id =:createdId', { createdId: userId }).getMany()
        const assignTask = await qb.andWhere('task.user_id =:userId', { userId: userId }).getMany()
        return [...createTask, ...assignTask];
    }


}
