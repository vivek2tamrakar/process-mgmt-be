import { Authorized, Body, Get, JsonController, Param, Patch, Post, Req } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { AssignService } from "../services/AssignService";
import { allRoles, UserRoles } from "../enums/Users";
import { AssignModel } from "../models/AssignModel";
import { DecodeTokenService } from "../services/DecodeTokenService";
import { Request } from "express";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/assign')

export class AssignController {
    constructor(
        @Service() private assignService: AssignService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized([UserRoles.TASKMANAGER,UserRoles.MANAGER,UserRoles.COMPANY,UserRoles.ADMIN])
    @Get('/group-list/:userId')
    @ResponseSchema(AssignModel, {
        description: `get group list whose assign to this user`,
        isArray: true
    })
    public async groupList(@Param('userId') userId:number,@Req() req: Request): Promise<AssignModel[]> {
        return await this.assignService.groupList(userId);
    }

    @Authorized([UserRoles.TASKMANAGER,UserRoles.MANAGER,UserRoles.COMPANY,UserRoles.ADMIN])
    @Get('/process-list/:userId')
    @ResponseSchema(AssignModel, {
        description: `get process list whose assign to this user`,
        isArray: true
    })
    public async processList(@Param('userId') userId:number,@Req() req: Request): Promise<AssignModel[]> {
        return await this.assignService.processList(userId);
    }

    @Authorized(allRoles)
    @Get('/group-id/:id')
    @ResponseSchema(AssignModel, {
        description: `particular group's users`,
        isArray: true
    })
    public async getUserOfParticularGroup(@Param('id') id: number, @Req() req: Request): Promise<AssignModel[]> {
        return await this.assignService.getUserOfParticularGroup(id);
    }

    @Authorized([UserRoles.COMPANY,UserRoles.ADMIN,UserRoles.TASKMANAGER,UserRoles.MANAGER])
    @Post('/')
    @ResponseSchema(AssignModel, {
        description: 'assign group'
    })
    public async assignGroup(@Body() body: any, @Req() req: any): Promise<AssignModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        body.userId = decodedToken?.id;
        return await this.assignService.assignGroup(body);
    }

    @Authorized([UserRoles.COMPANY,UserRoles.ADMIN,UserRoles.TASKMANAGER,UserRoles.MANAGER])
    @Patch('/')
    @ResponseSchema(AssignModel, {
        description: 'assign group'
    })
    public async editMembers(@Body() body: any, @Req() req: Request): Promise<AssignModel> {
        return await this.assignService.editMembers(body);
    }


}