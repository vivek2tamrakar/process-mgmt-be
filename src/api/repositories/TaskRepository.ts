import { EntityRepository, Repository } from "typeorm";
import { TaskModel } from "../models/TaskModel";

@EntityRepository(TaskModel)
export class TaskRepository extends Repository<TaskModel> {

}