import { Logger } from "../../decorators/Logger";
import { LoggerInterface } from "../../lib/logger";
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { ProcessModel } from "../models/ProcessModel";
import { ProcessRepository } from "../repositories/ProcessRepository";
import { StepRepository } from "../repositories/StepRepository";
// import { NotFound } from "../errors/Group";


@Service()
export class ProcessService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private processRepository: ProcessRepository,
        @OrmRepository() private stepRepository: StepRepository
    ) { }

    /* ------------------ add process------------------ */
    public async addProcess(body: any): Promise<ProcessModel | any> {
        this.log.info(`add process ${body}`)
        return await this.processRepository.save(body);
    }

    /* ---------------------- delete process ------------ */
    public async deleteProcess(processId: number, res: any): Promise<ProcessModel> {
        this.log.info(`delete process by ${processId}`)
        await this.processRepository.softDelete(processId)
        return res.status(200).send({ sucess: true, MESSAGE: 'SUCCESSFULLY_DELETE' })
    }


    /* ------------------- get processData by id ---------- */
    public async processDataById(processId: number): Promise<ProcessModel> {
        this.log.info(`get process data by id ${processId}`)
        return await this.processRepository.processDataById(processId)
    }

    /* ---------------- update process --------------- */
    public async updateProcess(body): Promise<ProcessModel | any> {
        this.log.info(`update process data by id ${body}`)
        if (body?.stepId) {
            const stepData = await this.stepRepository.findOne({ id: body?.stepId });
            stepData.stepDescription = body?.stepDescription;
            stepData.isCompleted = body?.isCompleted;
            return await this.stepRepository.save(stepData);
        }
        return await this.stepRepository.save({ processId: body?.id, stepDescription: body?.stepDescription });
    }


}