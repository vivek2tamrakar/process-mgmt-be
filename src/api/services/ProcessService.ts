import { Logger } from "../../decorators/Logger";
import { LoggerInterface } from "../../lib/logger";
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { ProcessModel } from "../models/ProcessModel";
import { ProcessRepository } from "../repositories/ProcessRepository";
import { StepRepository } from "../repositories/StepRepository";
import { ProcessAlreadyError } from "../errors/Process";
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
        if (body?.groupId)
            return await this.isProcessExist({ name: body?.name, userId: body?.userId, groupId: body.groupId }, body);
        else if (body?.folderId)
            return await this.isProcessExist({ name: body?.name, userId: body?.userId, folderId: body.folderId }, body);
        return await this.isProcessExist({ name: body?.name, userId: body?.userId }, body);
    }

    /* -------- to check process is exist or not -------------*/
    public async isProcessExist(processData, body): Promise<ProcessModel> {
        const isProcessExist = await this.processRepository.findOne(processData);
        if (isProcessExist) throw new ProcessAlreadyError()
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
        const processData = await this.processRepository.findOne({ id: body?.id });
        if (processData) {
            processData.name = body?.name;
            processData.tags = body?.tags;
            processData.description = body?.description;
            await this.processRepository.save(processData);
        }
        if (body?.stepId) {
            const stepData = await this.stepRepository.findOne({ id: body?.stepId });
            stepData.stepDescription = body?.stepDescription;
            return await this.stepRepository.save(stepData);
        }
        return await this.stepRepository.save({ processId: body?.id, stepDescription: body?.stepDescription });
    }


}