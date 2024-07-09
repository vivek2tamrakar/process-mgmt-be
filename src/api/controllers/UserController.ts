import { Authorized, Body, Delete, Get, JsonController, Param, Patch, Post, Req, Res } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { UserService } from "../services/UserService";
import { UserRoles } from "../enums/Users";
import { UserModel } from "../models/UserModel";
import { DecodeTokenService } from "../services/DecodeTokenService";
import { Request } from "express";
import { companyReq } from "./requests/Company";
import { validateOrReject } from "class-validator";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/users')

export class UserController {
    constructor(
        @Service() private userService: UserService,
        @Service() private decodeTokenService: DecodeTokenService
    ) {
    }

    @Authorized([UserRoles.TASKMANAGER,UserRoles.EMPLOYEE,UserRoles.COMPANY])
    @Get('/user-details/:id')
    @ResponseSchema(UserModel, {
        description: 'get user details by id',
        isArray: true
    })
    public async userDetailsById(@Param('id') id: number): Promise<UserModel> {
        return await this.userService.userDetailsById(id)
    }

    @Authorized(UserRoles.COMPANY)
    @Get('/list/:companyId')
    @ResponseSchema(UserModel, {
        description: 'list of companies user',
        isArray: true
    })
    public async companyUserList(@Param('companyId') companyId: number): Promise<UserModel[]> {
        return await this.userService.companyUserList(companyId)
    }

    @Post('/company')
    @ResponseSchema(UserModel, {
        description: 'add company'
    })
    public async addCompany(@Body() body: companyReq): Promise<UserModel> {
        await validateOrReject(body);
        return await this.userService.addCompany(body);
    }

    @Authorized(UserRoles.COMPANY)
    @Post('/')
    @ResponseSchema(UserModel, {
        description: 'add users of company'
    })
    public async addUser(@Body() body: any, @Req() req: Request): Promise<UserModel> {
        const decodedToken = await this.decodeTokenService.Decode(req.headers['authorization'])
        body.createdById = decodedToken?.id;
        return await this.userService.addUser(body, req.headers['authorization']);
    }

    @Authorized(UserRoles.COMPANY)
    @Patch('/')
    @ResponseSchema(UserModel, {
        description: 'update user of company'
    })
    public async updateUser(@Body() body: any, @Req() req: Request): Promise<UserModel> {
        return await this.userService.updateUser(body);
    }

    @Authorized([UserRoles.COMPANY, UserRoles.EMPLOYEE, UserRoles.TASKMANAGER, UserRoles.ADMIN, UserRoles.MANAGER])
    @Patch('/update-profile')
    @ResponseSchema(UserModel, {
        description: 'update profile by the user'
    })
    public async updateProfile(@Body() body: any, @Req() req: Request): Promise<UserModel> {
        return await this.userService.updateProfile(body);
    }

    @Authorized([UserRoles.COMPANY, UserRoles.EMPLOYEE, UserRoles.TASKMANAGER, UserRoles.ADMIN, UserRoles.MANAGER])
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


    @Authorized(UserRoles.COMPANY)
    @Delete('/:id')
    @ResponseSchema(UserModel, {
        description: 'update user of company'
    })
    public async deleteUser(@Param('id') id: number, @Res() res: any): Promise<UserModel> {
        return await this.userService.deleteUser(id, res);
    }

}