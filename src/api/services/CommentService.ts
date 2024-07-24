import { Service } from "typedi";
import { CommentsRepository } from "../repositories/CommentsRepository";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { CommentsModel } from "../models/CommentsModel";
import { CommentError } from "../errors/Comment";

@Service()
export class CommentService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private commentsRepository: CommentsRepository,
    ) { }

    /* ------------------- add ommnet ---------------- */
    public async addComment(body): Promise<CommentsModel> {
        this.log.info('add commnets')
        const commentData = await this.commentsRepository.findOne({ processId: body?.processId, name: body?.name })
        if (commentData) throw new CommentError();
        return await this.commentsRepository.save(body)
    }

    /* ------------------- comment list ---------------- */
    public async commentList(processId: number): Promise<CommentsModel[]> {
        this.log.info('get commnets list')
        return await this.commentsRepository.commentList(processId)
    }

}