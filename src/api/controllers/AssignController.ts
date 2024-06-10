import { Authorized, Body, JsonController, Patch, Post, Req } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { AssignService } from "../services/AssignService";
import { UserRoles } from "../enums/Users";
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

    @Authorized(UserRoles.COMPANY)
    @Post('/')
    @ResponseSchema(AssignModel, {
        description: 'assign group'
    })
    public async assignGroup(@Body() body: any, @Req() req: any): Promise<AssignModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        body.userId = decodedToken?.id;
        return await this.assignService.assignGroup(body);
    }

    @Authorized(UserRoles.COMPANY)
    @Patch('/')
    @ResponseSchema(AssignModel, {
        description: 'assign group'
    })
    public async editMembers(@Body() body: any, @Req() req: Request): Promise<AssignModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        body.userId = decodedToken?.id;
        return await this.assignService.editMembers(body);
    }


}