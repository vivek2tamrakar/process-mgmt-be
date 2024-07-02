import { Body, JsonController, Patch, Post } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
// import { UserRoles } from "../enums/Users";
import { TaskModel } from "../models/TaskModel";
import { TaskService } from "../services/TaskService";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/task')

export class TaskController {
    constructor(
        @Service() private taskService: TaskService,
    ) {
    }

    // @Authorized(UserRoles.COMPANY)
    @Post('/')
    @ResponseSchema(TaskModel, {
        description: 'add task',
    })
    public async addTask(@Body() body: any): Promise<TaskModel> {
        return await this.taskService.addTask(body)
    }

    @Patch('/')
    @ResponseSchema(TaskModel, {
        description: 'update task',
    })
    public async updateTask(@Body() body: any): Promise<TaskModel> {
        return await this.taskService.updateTask(body)
    }

}