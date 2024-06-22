import { Logger } from "../../decorators/Logger";
import { LoggerInterface } from "../../lib/logger";
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { ProcessModel } from "../models/ProcessModel";
import { ProcessRepository } from "../repositories/ProcessRepository";
import { StepRepository } from "../repositories/StepRepository";


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
        let isGroupExist, groupData, criteria;
        if (body?.groupId) criteria = { groupId: body?.groupId, name: body?.name }
        else if (body?.folderId) criteria = { folderId: body?.folderId, name: body?.name }
        else criteria = { userId: body?.userId, name: body?.name }
        isGroupExist = await this.findProcess(criteria);
        if (isGroupExist) body.processId = isGroupExist?.id
        else {
            body.tags = JSON.stringify(body?.tags);
            groupData = await this.processRepository.save(body);
            body.processId = groupData?.id
        }
        return await this.stepRepository.save({ step: body?.step, stepDescription: body?.stepDescription, processId: body?.processId });
    }

    public async findProcess(data: any): Promise<ProcessModel> {
        return await this.processRepository.findOne(data)
    }

    /* --------------------- process list ------------------*/
    public async processList(userId: number): Promise<ProcessModel[]> {
        this.log.info(`get process list ${userId}`)
        return await this.processRepository.processList(userId);
    }

    /* ---------------------- delete process ------------ */
    public async deleteProcess(processId: number, res: any): Promise<ProcessModel> {
        this.log.info(`delete process by ${processId}`)
        await this.processRepository.softDelete(processId)
        return res.status(200).send({ sucess: true, MESSAGE: 'SUCCESSFULLY_DELETE' })
    }


}