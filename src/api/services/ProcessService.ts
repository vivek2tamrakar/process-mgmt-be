import { Logger } from "../../decorators/Logger";
import { LoggerInterface } from "../../lib/logger";
import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { ProcessModel } from "../models/ProcessModel";
import { ProcessRepository } from "../repositories/ProcessRepository";

@Service()
export class ProcessService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private processRepository: ProcessRepository,
    ) { }

    /* ------------------ add process------------------ */
    public async addProcess(body: any): Promise<ProcessModel> {
        this.log.info(`add process ${body}`)
        return await this.processRepository.save(body);
    }

        /* --------------------- process list ------------------*/
        public async processList(userId: number): Promise<ProcessModel[]> {
            this.log.info(`get process list ${userId}`)
            return await this.processRepository.processList(userId);
        }


}