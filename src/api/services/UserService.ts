import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repositories/UserRepository";
import { UserModel } from "../models/UserModel";
import { LoggerInterface } from "../../lib/logger";
import { Logger } from "../../decorators/Logger";
import { CompanyError, EmailError } from "../errors/User";
import { NotFoundError } from "routing-controllers";
// import { AdminMail } from "../../mailers/userMailer";
import { AdminMail } from "../../mailers/userMailer";

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
      
    public async generateRandomPassword(length = 12) {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * charset.length);
          password += charset[randomIndex];
        }
        return password;
    }

    /* ------------------ add user of the company------------------ */
    public async addUser(body: any, token: string): Promise<any> {
        // token = token.split(' ')[1];
        this.log.info(`add user of the company ${body}`)
        const isExistEmail = await this.userRepository.findOne({ email: body?.email });
        if (isExistEmail) throw new EmailError()
        const password = await this.generateRandomPassword(12)
        body.password =  await UserModel.hashPassword(password);
        await AdminMail(body?.email, password)
        body.isActive = false;
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

    /* --------------------- update user -----------------*/
    public async updateUser(body: any): Promise<UserModel> {
        this.log.info(`update user ${body}`)
        const userData = await this.userRepository.findOne({ id: body?.id });
        if (userData) {
            userData.isActive = body?.isActive;
            userData.name = body?.name;
            userData.mobileNumber = body?.mobileNumber;
            return await this.userRepository.save(userData);
        }
        throw new NotFoundError()
    }

    public async deleteUser(id: number, res: any): Promise<UserModel> {
        this.log.info(`delete user ${id}`)
        const userData = await this.userRepository.findOne({ id: id });
        if (userData) {
            await this.userRepository.softDelete({ id: id });
            return res.status(200).send({ success: true, MESSAGE: 'SUCCESSFULLY_DELETE' })
        }
        throw new NotFoundError()
    }


}