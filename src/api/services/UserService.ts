import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repositories/UserRepository";
import { UserModel } from "../models/UserModel";
import { LoggerInterface } from "../../lib/logger";
import { Logger } from "../../decorators/Logger";
import { CompanyError, UserError } from "../errors/User";
// import { AdminMail } from "../../mailers/userMailer";

@Service()
export class UserService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository,
    ) { }

    /* ------------- user info by id ---------------------- */
    public async userInfoById(userId: number): Promise<UserModel> {
        this.log.info(`userIngo by id ${userId}`)
        return await this.userRepository.findOne({ id: userId })
    }

    /* ------------------ add user of the company------------------ */
    public async addUser(body: any): Promise<UserModel> {
        this.log.info(`add user of the company ${body}`)
        const isExistEmail = await this.userRepository.findOne({ email: body?.email });
        if (isExistEmail) throw new UserError()
        // await AdminMail(body?.email, body?.password)
        // const hashpassword = await UserModel.hashPassword(body?.password);
        // body.password = hashpassword;
        // body.isActive = false;
        return await this.userRepository.save(body);
    }

    /* -------------------- add company ------------------------ */
    public async addCompany(body: any): Promise<UserModel> {
        this.log.info(`add company ${body}`)
        const isCompanyExist = await this.userRepository.findOne({ name: body?.name });
        if (isCompanyExist) throw new CompanyError()
        const hashpassword = await UserModel.hashPassword(body?.password);
        body.password = hashpassword;
        return await this.userRepository.save(body);
    }

    /* --------------------- company user list ------------------*/
    public async companyUserList(companyId: number): Promise<UserModel[]> {
        this.log.info(`get company user's list ${companyId}`)
        return await this.userRepository.companyUserList(companyId);
    }


}