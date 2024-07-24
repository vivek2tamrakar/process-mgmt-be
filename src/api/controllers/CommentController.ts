import { Authorized, Body, Get, JsonController, Param, Post } from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import { CommentService } from "../services/CommentService";
import { CommentsModel } from "../models/CommentsModel";
import { allRoles } from "../enums/Users";

@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/comment')

export class CommentController {
    constructor(
        @Service() private commentService: CommentService
    ) {
    }

    @Authorized(allRoles)
    @Get('/list/:processId')
    @ResponseSchema(CommentsModel, {
        description: 'comment list by process id ',
        isArray:true
    })
    public async commentList(@Param('processId') processId: number): Promise<CommentsModel[]> {
        return await this.commentService.commentList(processId)
    }

    @Authorized(allRoles)
    @Post('/')
    @ResponseSchema(CommentsModel, {
        description: 'add comment '
    })
    public async addComment(@Body() body: any): Promise<CommentsModel> {
        return await this.commentService.addComment(body)
    }


}