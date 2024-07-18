import { EntityRepository, Repository } from "typeorm";
import { CommentsModel } from "../models/CommentsModel";

@EntityRepository(CommentsModel)
export class CommentsRepository extends Repository<CommentsModel> {
}