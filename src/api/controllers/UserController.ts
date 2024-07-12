import { Authorized, Body, Delete, Get, JsonController, Param, Patch, Post, Req, Res, UseBefore } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { UserService } from "../services/UserService";
import { allRoles, UserRoles } from "../enums/Users";
import { UserModel } from "../models/UserModel";
import { DecodeTokenService } from "../services/DecodeTokenService";
import { Request } from "express";
import { companyReq } from "./requests/Company";
import { validateOrReject } from "class-validator";
import { env } from "../../env";
import multer from 'multer';
import { fileUploadOptions } from "../fileUpload";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/users')

export class UserController {
    constructor(
        @Service() private userService: UserService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized(allRoles)
    @Get('/user-details/:id')
    @ResponseSchema(UserModel, {
        description: 'get user details by id',
        isArray: true
    })
    public async userDetailsById(@Param('id') id: number): Promise<UserModel> {
        return await this.userService.userDetailsById(id)
    }

    @Authorized([UserRoles.COMPANY, UserRoles.ADMIN, UserRoles.MANAGER, UserRoles.TASKMANAGER])
    @Get('/list/:userId')
    @ResponseSchema(UserModel, {
        description: 'list of companies user',
        isArray: true
    })
    public async companyUserList(@Param('userId') userId: number): Promise<UserModel[]> {
        return await this.userService.companyUserList(userId)
    }

    @Post('/company')
    @ResponseSchema(UserModel, {
        description: 'add company'
    })
    public async addCompany(@Body() body: companyReq): Promise<UserModel> {
        await validateOrReject(body);
        return await this.userService.addCompany(body);
    }

    @Authorized([UserRoles.COMPANY, UserRoles.ADMIN])
    @Post('/')
    @ResponseSchema(UserModel, {
        description: 'add users'
    })
    public async addUser(@Body() body: any, @Req() req: Request): Promise<UserModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        body.createdById = decodedToken?.id;
        return await this.userService.addUser(body, req.headers['authorization']);
    }

    @Authorized([UserRoles.COMPANY, UserRoles.ADMIN])
    @Patch('/')
    @ResponseSchema(UserModel, {
        description: 'update user of company'
    })
    public async updateUser(@Body() body: any, @Req() req: Request): Promise<UserModel> {
        return await this.userService.updateUser(body);
    }

    @Authorized(allRoles)
    @Patch('/update-profile')
    @UseBefore(multer(fileUploadOptions).fields([
        { maxCount: 1, name: 'profilePic' },
    ]))
    @ResponseSchema(UserModel, {
        contentType: 'multipart/form-data',
        description: 'update user profile',
    })
    public async updateProfile(@Body() body: any, @Req() req: Request): Promise<UserModel> {
        if (req['files']?.profilePic) {
            body.profilePic = env.app.schema + '://' + req.headers['host'] + '/uploads/' + req['files']?.profilePic[0].filename;
        }
        return await this.userService.updateProfile(body);
    }

    @Authorized(allRoles)
    @Patch('/change-password')
    @ResponseSchema(UserModel, {
        description: 'change password by the user'
    })
    public async changePassword(@Body() body: any, @Req() req: Request): Promise<UserModel> {
        return await this.userService.changePassword(body);
    }

    @Patch('/forget-password')
    @ResponseSchema(UserModel, {
        description: 'forget password by the user'
    })
    public async forgetPassword(@Body() body: any, @Req() req: Request): Promise<UserModel> {
        return await this.userService.forgetPassword(body);
    }


    @Authorized([UserRoles.COMPANY, UserRoles.ADMIN])
    @Delete('/:id')
    @ResponseSchema(UserModel, {
        description: 'update user of company'
    })
    public async deleteUser(@Param('id') id: number, @Res() res: any): Promise<UserModel> {
        return await this.userService.deleteUser(id, res);
    }

}