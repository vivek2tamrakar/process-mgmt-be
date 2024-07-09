import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskModel } from "../models/TaskModel";
import { TaskNotFound } from "../errors/Task";
import { UserRoles } from "../enums/Users";

@Service()
export class TaskService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private taskRepository: TaskRepository,
    ) {
    }

    /* ----------------------add  task  ------------ */
    public async addTask(body: any): Promise<TaskModel> {
        this.log.info(`add task`)
        let modifyData = body?.userId?.map((ele) => {
            return {
                groupId: body?.groupId,
                name: body?.name,
                description: body?.description,
                userId: ele,
                processId: body?.processId,
                startDate: body?.startDate,
                endDate: body?.endDate,
                duration: body?.duration,
                isProcess: body?.isProcess,
                isDayTask: body?.isDayTask,
                remainder: body?.remainder,
                createdId: body?.createdId,
                recurrenType: body?.recurrenType,
                recurrenStartDate: body?.recurrenStartDate,
                recurrenEndDate: body?.recurrenEndDate
            }
        })
        return await this.taskRepository.save(modifyData);
    }

    /* ----------------------update task  ------------ */
    public async updateTask(body, roleId: number): Promise<TaskModel> {
        this.log.info(`update task`)
        let isTaskExist = await this.taskRepository.findOne({ id: body?.id });
        if (!isTaskExist) throw new TaskNotFound()
        isTaskExist.status = body?.status;
        if (roleId == UserRoles.TASKMANAGER) {
            isTaskExist.isActive = body?.isActive;
            isTaskExist.name = body?.name;
            isTaskExist.description = body?.description;
            isTaskExist.userId = body?.userId;
            isTaskExist.processId = body?.processId;
            isTaskExist.startDate = body?.startDate;
            isTaskExist.endDate = body?.endDate;
            isTaskExist.duration = body?.duration;
        }
        return await this.taskRepository.save(isTaskExist);
    }

    /* ---------------------- delete task ------------ */
    public async deleteTask(taskId: number, res: any): Promise<TaskModel> {
        this.log.info(`delete task by ${taskId}`)
        await this.taskRepository.softDelete({ id: taskId })
        return res.status(200).send({ sucess: true, MESSAGE: 'SUCCESSFULLY_DELETE' })
    }

    /* ---------------------- task list ------------ */
    public async taskList(createdId: number): Promise<TaskModel[]> {
        this.log.info(`task list by ${createdId}`)
        return await this.taskRepository.taskList(createdId)
    }


}