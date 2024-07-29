import { Authorized, Body, Delete, Get, JsonController, Param, Patch, Post, QueryParams, Req, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { TaskModel } from "../models/TaskModel";
import { TaskService } from "../services/TaskService";
import { allRoles, UserRoles } from "../enums/Users";
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

    @Authorized([UserRoles.TASKMANAGER, UserRoles.MANAGER, UserRoles.ADMIN, UserRoles.COMPANY])
    @Get('/send-email/:id')
    @ResponseSchema(TaskModel, {
        description: 'send email to the user',
    })
    public async sendEmail(@Param('id') id: number, @QueryParams() param: any, @Res() res: any): Promise<TaskModel[]> {
        return await this.taskService.sendEmail(id, res, param)
    }

    @Authorized(allRoles)
    @Get('/:id')
    @ResponseSchema(TaskModel, {
        description: 'task assign and create by the user and get by user id',
        isArray: true
    })
    public async getTaskByUserId(@Param('id') id: number, @QueryParams() param: any): Promise<TaskModel[]> {
        return await this.taskService.getTaskByUserId(id, param)
    }

    @Authorized(allRoles)
    @Post('/')
    @ResponseSchema(TaskModel, {
        description: 'add task',
    })
    public async addTask(@Body() body: any): Promise<TaskModel> {
        return await this.taskService.addTask(body)
    }

    @Authorized(allRoles)
    @Patch('/')
    @ResponseSchema(TaskModel, {
        description: 'update task',
    })
    public async updateTask(@Body() body: any, @Req() req: any): Promise<TaskModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        let roleId = decodedToken?.role;
        return await this.taskService.updateTask(body, roleId)
    }

    @Authorized([UserRoles.TASKMANAGER, UserRoles.MANAGER, UserRoles.ADMIN, UserRoles.COMPANY])
    @Delete('/:id')
    @ResponseSchema(TaskModel, {
        description: 'delete task'
    })
    public async deleteTask(@Param('id') id: number, @Res() res: Response): Promise<TaskModel> {
        return await this.taskService.deleteTask(id, res)
    }

}