import { Authorized, Body, Delete, Get, JsonController, Param, Patch, Post, Req, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { GroupService } from "../services/GroupService";
import { UserRoles } from "../enums/Users";
import { GroupModel } from "../models/GroupModel";
import { DecodeTokenService } from "../services/DecodeTokenService";
import { Request,Response } from "express";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/group')

export class GroupController {
    constructor(
        @Service() private groupService: GroupService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized(UserRoles.COMPANY)
    @Get('/group-list')
    @ResponseSchema(GroupModel, {
        description: 'get Group List',
        isArray: true
    })
    public async groupList(@Req() req: Request): Promise<GroupModel[]> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        let userId = decodedToken?.id;
        return await this.groupService.groupList(userId);
    }

    @Authorized(UserRoles.COMPANY)
    @Get('/list')
    @ResponseSchema(GroupModel, {
        description: 'get Group List',
        isArray: true
    })
    public async getGroup(@Req() req: Request): Promise<GroupModel[]> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        let userId = decodedToken?.id;
        return await this.groupService.getGroup(userId);
    }

    @Authorized(UserRoles.COMPANY)
    @Get('/id/:id')
    @ResponseSchema(GroupModel, {
        description: 'get Group List',
        isArray: true
    })
    public async assignGroupsUser(@Param('id') id: number): Promise<GroupModel> {
        return await this.groupService.assignGroupsUser(id);
    }

    @Authorized(UserRoles.COMPANY)
    @Post('/')
    @ResponseSchema(GroupModel, {
        description: 'add group by company'
    })
    public async addGroup(@Body() body: any, @Req() req: Request): Promise<GroupModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        let id = decodedToken?.id;
        return await this.groupService.addGroup(body, id)
    }

    @Authorized(UserRoles.COMPANY)
    @Patch('/')
    @ResponseSchema(GroupModel, {
        description: 'edit group ,folder,process'
    })
    public async editGroupFolderProcess(@Body() body: any): Promise<GroupModel> {
        return await this.groupService.editGroupFolderProcess(body)
    }

    // @Authorized(UserRoles.COMPANY)
    @Delete('/:id')
    @ResponseSchema(GroupModel, {
        description: 'delete group'
    })
    public async deleteGroup(@Param('id') id: number,@Res() res:Response): Promise<GroupModel> {
        return await this.groupService.deleteGroup(id,res)
    }


}