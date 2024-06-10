import { Authorized, Body, Get, JsonController, Post, Req } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { ProcessService } from "../services/ProcessService";
import { UserRoles } from "../enums/Users";
import { ProcessModel } from "../models/ProcessModel";
import { DecodeTokenService } from "../services/DecodeTokenService";
import { Request } from "express";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/process')

export class ProcessController {
    constructor(
        @Service() private processService: ProcessService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized(UserRoles.COMPANY)
    @Get('/list')
    @ResponseSchema(ProcessModel, {
        description: 'list of companies user',
        isArray: true
    })
    public async processList(@Req() req: Request): Promise<ProcessModel[]> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        let userId = decodedToken?.id;
        return await this.processService.processList(userId)
    }

    @Authorized(UserRoles.COMPANY)
    @Post('/')
    @ResponseSchema(ProcessModel, {
        description: 'add process by company'
    })
    public async addProcess(@Body() body: any, @Req() req: Request): Promise<ProcessModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        body.userId = decodedToken?.id;
        return await this.processService.addProcess(body)
    }
}