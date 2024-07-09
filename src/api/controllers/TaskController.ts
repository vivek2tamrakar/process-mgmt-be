import { Authorized, Body, Delete, Get, JsonController, Param, Patch, Post, Req, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { TaskModel } from "../models/TaskModel";
import { TaskService } from "../services/TaskService";
import { UserRoles } from "../enums/Users";
import { Response } from "express";
import { DecodeTokenService } from "../services/DecodeTokenService";


@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/task')

export class TaskController {
    constructor(
        @Service() private taskService: TaskService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized(UserRoles.TASKMANAGER)
    @Get('/list')
    @ResponseSchema(TaskModel, {
        description: 'task list by task manager',
        isArray: true
    })
    public async taskList(@Req() req: any): Promise<TaskModel[]> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        return await this.taskService.taskList(decodedToken?.id)
    }

    @Authorized([UserRoles.TASKMANAGER])
    @Post('/')
    @ResponseSchema(TaskModel, {
        description: 'add task',
    })
    public async addTask(@Body() body: any): Promise<TaskModel> {

        return await this.taskService.addTask(body)
    }

    @Authorized([UserRoles.TASKMANAGER,UserRoles.EMPLOYEE])
    @Patch('/')
    @ResponseSchema(TaskModel, {
        description: 'update task',
    })
    public async updateTask(@Body() body: any,@Req() req:any): Promise<TaskModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        let roleId = decodedToken?.role;
        return await this.taskService.updateTask(body,roleId)
    }

    @Authorized(UserRoles.TASKMANAGER)
    @Delete('/:id')
    @ResponseSchema(TaskModel, {
        description: 'delete task'
    })
    public async deleteTask(@Param('id') id: number, @Res() res: Response): Promise<TaskModel> {
        return await this.taskService.deleteTask(id, res)
    }

}