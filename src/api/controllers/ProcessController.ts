import { Authorized, Body, JsonController, Post, Req } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { ProcessService } from "../services/ProcessService";
import { UserRoles } from "../enums/Users";
import { ProcessModel } from "../models/ProcessModel";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/process')

export class ProcessController {
    constructor(
        @Service() private processService: ProcessService,
    ) {
    }

    @Authorized([UserRoles.COMPANY,UserRoles.ADMIN])
    @Post('/')
    @ResponseSchema(ProcessModel, {
        description: 'add process by company'
    })
    public async addProcess(@Body() body: any, @Req() req: any): Promise<ProcessModel> {
        return await this.processService.addProcess(body)
    }
}