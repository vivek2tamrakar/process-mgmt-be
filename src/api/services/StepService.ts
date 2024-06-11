import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { StepRepository } from "../repositories/StepRepository";
import { StepModel } from "../models/StepModel";
import { Logger, LoggerInterface } from "../../decorators/Logger";

@Service()
export class StepService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private stepRepository: StepRepository,
    ) {
    }

    /* ---------------------- delete process ------------ */
    public async deleteStep(stepId: number, res: any): Promise<StepModel> {
        this.log.info(`delete step by ${stepId}`)
        await this.stepRepository.softDelete(stepId)
        return res.status(200).send({ sucess: true, MESSAGE: 'SUCCESSFULLY_DELETE' })
    }

}