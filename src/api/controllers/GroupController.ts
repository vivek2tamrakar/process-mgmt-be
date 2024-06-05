import { Authorized, Body, Get, JsonController, Post, QueryParams, Req } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { GroupService } from "../services/GroupService";
import { UserRoles } from "../enums/Users";
import { GroupModel } from "../models/GroupModel";
import { DecodeTokenService } from "../services/DecodeTokenService";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/group')

export class GroupController {
    constructor(
        @Service() private groupService: GroupService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized(UserRoles.COMPANY)
    @Get('/list')
    @ResponseSchema(GroupModel, {
        description: 'get Group List',
        isArray: true
    })
    public async getGroup(@QueryParams() params: any): Promise<GroupModel[]> {
        return await this.groupService.getGroup(params)
    }

    @Authorized(UserRoles.COMPANY)
    @Post('/')
    @ResponseSchema(GroupModel, {
        description: 'add group by company'
    })
    public async addGroup(@Body() body: any, @Req() req: any): Promise<GroupModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        let id = decodedToken?.id;
        return await this.groupService.addGroup(body, id)
    }



}