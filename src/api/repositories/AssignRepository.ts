import { EntityRepository, Repository } from "typeorm";
import { AssignModel } from "../models/AssignModel";

@EntityRepository(AssignModel)
export class AssignRepository extends Repository<AssignModel> {

}