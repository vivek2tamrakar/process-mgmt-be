import { EntityRepository, Repository } from "typeorm";
import { StepModel } from "../models/StepModel";

@EntityRepository(StepModel)
export class StepRepository extends Repository<StepModel> {

}