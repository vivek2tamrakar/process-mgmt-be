import { Authorized, Body, Delete, Get, JsonController, Param, Patch, Post, Req, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { GroupService } from "../services/GroupService";
import { allRoles, UserRoles } from "../enums/Users";
import { GroupModel } from "../models/GroupModel";
import { DecodeTokenService } from "../services/DecodeTokenService";
import { Request, Response } from "express";
import { validateOrReject } from "class-validator";
import { GroupReq } from "./requests/Group";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/group')

export class GroupController {
    constructor(
        @Service() private groupService: GroupService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized([UserRoles.COMPANY, UserRoles.TASKMANAGER,UserRoles.MANAGER,UserRoles.ADMIN,UserRoles.EMPLOYEE])
    @Get('/home/:userId')
    @ResponseSchema(GroupModel, {
        description: 'home api',
        isArray: true
    })
    public async homeData(@Param('userId') userId:number,@Req() req: Request): Promise<GroupModel[]> {
        // const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        // let userId = decodedToken?.id;
        return await this.groupService.homeData(userId);
    }

    @Authorized(allRoles)
    @Get('/list/:userId')
    @ResponseSchema(GroupModel, {
        description: 'get Group List',
        isArray: true
    })
    public async getGroup(@Param('userId') userId:number,@Req() req: Request): Promise<GroupModel[]> {
        // const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        // let userId = decodedToken?.id;
        // let roleId = decodedToken?.role;
        return await this.groupService.getGroup(userId);
    }

    @Authorized(allRoles)
    @Get('/id/:id')
    @ResponseSchema(GroupModel, {
        description: 'get Group List',
        isArray: true
    })
    public async assignGroupsUser(@Param('id') id: number): Promise<GroupModel> {
        return await this.groupService.assignGroupsUser(id);
    }


    @Authorized([UserRoles.COMPANY, UserRoles.TASKMANAGER,UserRoles.MANAGER,UserRoles.ADMIN])
    @Post('/')
    @ResponseSchema(GroupModel, {
        description: 'add group'
    })
    public async addGroup(@Body() body: GroupReq, @Req() req: Request): Promise<GroupModel> {
        await validateOrReject(GroupReq)
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        let id = decodedToken?.id;
        return await this.groupService.addGroup(body, id)
    }

    @Authorized([UserRoles.COMPANY, UserRoles.TASKMANAGER,UserRoles.MANAGER,UserRoles.ADMIN])
    @Patch('/')
    @ResponseSchema(GroupModel, {
        description: 'edit group ,folder,process'
    })
    public async editGroupFolderProcess(@Body() body: any): Promise<GroupModel> {
        return await this.groupService.editGroupFolderProcess(body)
    }

    @Authorized([UserRoles.COMPANY, UserRoles.TASKMANAGER,UserRoles.MANAGER,UserRoles.ADMIN])
    @Delete('/:id')
    @ResponseSchema(GroupModel, {
        description: 'delete group'
    })
    public async deleteGroup(@Param('id') id: number, @Res() res: Response): Promise<GroupModel> {
        return await this.groupService.deleteGroup(id, res)
    }


}