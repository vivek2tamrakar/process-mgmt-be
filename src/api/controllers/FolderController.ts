import { Authorized, Body, Get, JsonController, Post, Req } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { FolderService } from "../services/FolderService";
import { UserRoles } from "../enums/Users";
import { FolderModel } from "../models/FolderModel";
import { DecodeTokenService } from "../services/DecodeTokenService";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/folder')

export class FolderController {
    constructor(
        @Service() private folderService: FolderService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized(UserRoles.COMPANY)
    @Get('/list')
    @ResponseSchema(FolderModel, {
        description: 'list of companies user',
        isArray: true
    })
    public async folderList(@Req() req: any): Promise<FolderModel[]> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        let userId = decodedToken?.id;
        return await this.folderService.folderList(userId)
    }


    @Authorized([UserRoles.COMPANY, UserRoles.ADMIN])
    @Post('/')
    @ResponseSchema(FolderModel, {
        description: 'add folder by user'
    })
    public async addFolder(@Body() body: any): Promise<FolderModel> {
        return await this.folderService.addFolder(body)
    }
}