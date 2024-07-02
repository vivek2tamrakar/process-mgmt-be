import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskModel } from "../models/TaskModel";

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
                "groupId": body?.groupId,
                "name": body?.name,
                "description": body?.description,
                "userId": ele,
                "processId": body?.processId,
                "startDate": body?.startDate,
                "endDate": body?.endDate,
                "duration": body?.duration
            }
        })
        return await this.taskRepository.save(modifyData);
    }

}