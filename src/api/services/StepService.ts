import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { StepRepository } from "../repositories/StepRepository";
import { StepModel } from "../models/StepModel";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { ProcessRepository } from "../repositories/ProcessRepository";

@Service()
export class StepService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private stepRepository: StepRepository,
        @OrmRepository() private processRepository: ProcessRepository
    ) {
    }

    /* ---------------- update run checklist --------------- */
    public async updateRunChecklist(body): Promise<StepModel | any> {
        this.log.info(`update run checklist}`)
        if (body?.isReview) {
            const processData = await this.processRepository.findOne({ id: body?.processId });
            processData.isReview = body?.isReview;
            processData.reviewDate = new Date()
            await this.processRepository.save(processData);
        }
        const res = await Promise.all(body?.id?.map(async (ele, i) => {
            let stepData = await this.stepRepository.findOne({ id: ele });
            stepData.isCompleted = body?.isCompleted[i];
            stepData.lastReview = new Date();
            return await this.stepRepository.save(stepData);
        }))
        return res;
    }

    /* ---------------------- delete process ------------ */
    public async deleteStep(stepId: number, res: any): Promise<StepModel> {
        this.log.info(`delete step by ${stepId}`)
        await this.stepRepository.softDelete(stepId)
        return res.status(200).send({ sucess: true, MESSAGE: 'SUCCESSFULLY_DELETE' })
    }

}