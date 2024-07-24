import { EntityRepository, Repository } from "typeorm";
import { CommentsModel } from "../models/CommentsModel";

@EntityRepository(CommentsModel)
export class CommentsRepository extends Repository<CommentsModel> {

    public async commentList(processId: number): Promise<CommentsModel[]> {
        const qb = await this.createQueryBuilder('comments')
            .select([
                'comments.id', 'comments.name', 'comments.createdAt', 'comments.updatedAt',
                'user.id', 'user.name', 'user.email'
            ])
            .leftJoin('comments.user', 'user')
            .andWhere('comments.process_id =:processId', { processId: processId })
        return qb.getMany()
    }
}