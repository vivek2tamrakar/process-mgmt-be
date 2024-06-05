import { Authorized, Body, JsonController, Post, Req } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { FolderService } from "../services/FolderService";
import { UserRoles } from "../enums/Users";
import { FolderModel } from "../models/FolderModel";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/folder')

export class FolderController {
    constructor(
        @Service() private folderService: FolderService,
    ) {
    }

    @Authorized([UserRoles.COMPANY,UserRoles.ADMIN])
    @Post('/')
    @ResponseSchema(FolderModel, {
        description: 'add folder by user'
    })
    public async addFolder(@Body() body: any, @Req() req: any): Promise<FolderModel> {
        return await this.folderService.addFolder(body)
    }
}