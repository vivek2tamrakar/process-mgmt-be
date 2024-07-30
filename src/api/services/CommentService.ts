import { Service } from "typedi";
import { CommentsRepository } from "../repositories/CommentsRepository";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { CommentsModel } from "../models/CommentsModel";

@Service()
export class CommentService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private commentsRepository: CommentsRepository,
    ) { }

    /* ------------------- add ommnet ---------------- */
    public async addComment(body): Promise<CommentsModel> {
        this.log.info('add commnets')
        return await this.commentsRepository.save(body)
    }
    
    /* ------------------- get commnets ---------------- */
    public async getComments(processId): Promise<CommentsModel[]> {
        this.log.info('get commnets')
        return  await this.commentsRepository.getCommentList(processId)
    }

}