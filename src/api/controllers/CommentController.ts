import { Authorized, Body, Get, JsonController, Post } from "routing-controllers";
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
    @Post('/')
    @ResponseSchema(CommentsModel, {
        description: 'add comment '
    })
    public async addComment(@Body() body: any): Promise<CommentsModel> {
        return await this.commentService.addComment(body)
    }
    @Authorized(allRoles)
    @Get('/')
    @ResponseSchema(CommentsModel, {
        description: 'Get comment '
    })
    public async getComment(@Body() body: any): Promise<CommentsModel[]> {
        return await this.commentService.getComments(body)
    }


}