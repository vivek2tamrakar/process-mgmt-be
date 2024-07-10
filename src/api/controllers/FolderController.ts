import { Authorized, Body, Delete, Get, JsonController, Param, Post, Req, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { FolderService } from "../services/FolderService";
import { UserRoles } from "../enums/Users";
import { FolderModel } from "../models/FolderModel";
import { DecodeTokenService } from "../services/DecodeTokenService";
import { Request, Response } from "express";
import { folderReq } from "./requests/Folder";
import { validateOrReject } from "class-validator";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/folder')

export class FolderController {
    constructor(
        @Service() private folderService: FolderService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized([UserRoles.COMPANY, UserRoles.TASKMANAGER, UserRoles.MANAGER, UserRoles.ADMIN])
    @Get('/:id')
    @ResponseSchema(FolderModel, {
        description: 'get folder data by id'
    })
    public async folderDataById(@Param('id') id: number): Promise<FolderModel> {
        return await this.folderService.folderDataById(id)
    }

    @Authorized([UserRoles.COMPANY, UserRoles.TASKMANAGER, UserRoles.MANAGER, UserRoles.ADMIN])
    @Post('/')
    @ResponseSchema(FolderModel, {
        description: 'add folder'
    })
    public async addFolder(@Body() body: folderReq, @Req() req: Request): Promise<FolderModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        body.userId = decodedToken?.id;
        await validateOrReject(body)
        return await this.folderService.addFolder(body)
    }

    @Authorized([UserRoles.COMPANY, UserRoles.TASKMANAGER, UserRoles.MANAGER, UserRoles.ADMIN])
    @Delete('/:id')
    @ResponseSchema(FolderModel, {
        description: 'delete folder'
    })
    public async deleteFolder(@Param('id') id: number, @Res() res: Response): Promise<FolderModel> {
        return await this.folderService.deleteFolder(id, res)
    }


}