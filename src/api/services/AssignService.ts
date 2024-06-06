import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { AssignRepository } from "../repositories/AssignRepository";
import { AssignModel } from "../models/AssignModel";

@Service()
export class AssignService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private assignRepository: AssignRepository,
    ) { }

    /* ------------------ assign user by the company------------------ */
    public async assignGroup(body: any): Promise<AssignModel> {
        this.log.info(`assign user  ${body}`)
        return await this.assignRepository.save(body);
    }

}