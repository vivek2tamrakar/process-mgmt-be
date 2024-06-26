import { Authorized, Body, Delete, Get, JsonController, Param, Patch, Post, Req, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { ProcessService } from "../services/ProcessService";
import { UserRoles } from "../enums/Users";
import { ProcessModel } from "../models/ProcessModel";
import { DecodeTokenService } from "../services/DecodeTokenService";
import { Request, Response } from "express";
import { ProcessReq } from "./requests/Process";
import { validateOrReject } from "class-validator";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/process')

export class ProcessController {
    constructor(
        @Service() private processService: ProcessService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized(UserRoles.COMPANY)
    @Get('/:id')
    @ResponseSchema(ProcessModel, {
        description: 'get process data by id'
    })
    public async processDataById(@Param('id') id: number): Promise<ProcessModel> {
        return await this.processService.processDataById(id);
    }

    @Authorized(UserRoles.COMPANY)
    @Post('/')
    @ResponseSchema(ProcessModel, {
        description: 'add process by company'
    })
    public async addProcess(@Body() body: ProcessReq, @Req() req: Request): Promise<ProcessModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        body.userId = decodedToken?.id;
        await validateOrReject(body);
        return await this.processService.addProcess(body)
    }

    @Authorized(UserRoles.COMPANY)
    @Patch('/')
    @ResponseSchema(ProcessModel, {
        description: 'add process by company'
    })
    public async updateProcess(@Body() body: ProcessReq, @Req() req: Request): Promise<ProcessModel> {
        return await this.processService.updateProcess(body)
    }

    @Authorized(UserRoles.COMPANY)
    @Delete('/:id')
    @ResponseSchema(ProcessModel, {
        description: 'delete process'
    })
    public async deleteProcess(@Param('id') id: number, @Res() res: Response): Promise<ProcessModel> {
        return await this.processService.deleteProcess(id, res)
    }


}