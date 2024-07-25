import { EntityRepository, Repository } from "typeorm";
import { CommentsModel } from "../models/CommentsModel";

@EntityRepository(CommentsModel)
export class CommentsRepository extends Repository<CommentsModel> {

    public async getCommentList(process_id): Promise<CommentsModel[] | any> {
        const qb = await this.createQueryBuilder('comments')
            .select([
                'comments.id', 'comments.name','comments.createdAt','comments.updatedAt',
                'user.id', 'user.email','user.name'
            ])
            .leftJoin('comments.user', 'user')
        const res = qb.andWhere('comments.process_id =:process_id', { process_id: process_id }).getMany();
        return res;
    }
}