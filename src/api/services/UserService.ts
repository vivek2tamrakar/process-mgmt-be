import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { UserRepository } from "../repositories/UserRepository";
import { UserModel } from "../models/UserModel";
import { LoggerInterface } from "../../lib/logger";
import { Logger } from "../../decorators/Logger";
import { CompanyError, EmailError, PasswordError } from "../errors/User";
import { ProcessMail } from "../../mailers/userMailer";
import { AdminMail } from "../../mailers/userMailer";
import { UserNotFoundError } from "../errors/Admin";
import { UserRoles } from "../enums/Users";
import MessageResponse from "../message";
import { ProcessService } from "./ProcessService";

@Service()
export class UserService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository,
        @Service() private processService: ProcessService
    ) { }

    /* ------------- user info by id ---------------------- */
    public async userInfoById(userId: number): Promise<UserModel> {
        this.log.info(`userIngo by id ${userId}`)
        const user = await this.userRepository.createQueryBuilder('user')
            .select(['user.id', 'user.name', 'user.email', 'user.isActive', 'user.fcmToken', 'user.profilePic', 'user.mobileNumber', 'user.role', 'user.createdById'])
            .where('user.id = :id', { id: userId })
            .getOne();

        return user;
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
        body.password = await UserModel.hashPassword(password);
        await AdminMail(body?.email, password)
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
        const companyData = await this.userInfoById(companyId);
        if (companyData?.role == UserRoles.COMPANY)
            return await this.userRepository.companyUserList(companyId);
        return await this.userRepository.companyUserList(companyData?.createdById);
    }

    /* --------------------- get user details by id ------------------*/
    public async userDetailsById(userId: number): Promise<UserModel> {
        this.log.info(`get user details by id ${userId}`)
        return await this.userRepository.userDetailsById(userId);
    }

    /* --------------------- update user -----------------*/
    public async updateUser(body: any): Promise<UserModel> {
        this.log.info(`update user ${body}`)
        const userData = await this.userRepository.findOne({ id: body?.id });
        if (userData) {
            userData.role = body?.role;
            userData.isActive = body?.isActive;
            userData.name = body?.name;
            userData.mobileNumber = body?.mobileNumber;
            return await this.userRepository.save(userData);
        }
        throw new UserNotFoundError()
    }

    public async deleteUser(id: number, res: any): Promise<UserModel> {
        this.log.info(`delete user ${id}`)
        const userData = await this.userRepository.findOne({ id: id });
        if (userData) {
            await this.userRepository.softDelete({ id: id });
            return res.status(200).send({ success: true, MESSAGE: 'SUCCESSFULLY_DELETE' })
        }
        throw new UserNotFoundError()
    }

    /* --------------------- update profile by the user -----------------*/
    public async updateProfile(body: any): Promise<UserModel | any> {
        this.log.info(`update profile by the user `)
        const userData = await this.userRepository.findOne({ id: body?.id });
        if (userData) {
            userData.name = body?.name;
            userData.mobileNumber = body?.mobileNumber;
            userData.profilePic = body?.profilePic;
            const res = await this.userRepository.save(userData);
            return {
                id: res?.id, email: res?.email, createdById: res?.createdById, isActive: res?.isActive, fcmToken: res?.fcmToken, role: res?.role, profilePic: res?.profilePic, updatedAt: res?.updatedAt,
                message: MessageResponse.UPDATE
            }
        }
        throw new UserNotFoundError()
    }

    /* --------------------- update profile by the user -----------------*/
    public async changePassword(body: any): Promise<UserModel> {
        this.log.info(`update profile by the user ${body}`)
        const userData = await this.userRepository.findOne({ id: body?.id });
        if (userData) {
            const isPassword = await UserModel.comparePassword(userData, body['oldPassword'])
            if (isPassword) {
                const hashPassword = await UserModel.hashPassword(body['newPassword']);
                userData.password = hashPassword;
                return await this.userRepository.save(userData);
            }
            throw new PasswordError()
        }
        throw new UserNotFoundError();
    }


    /* --------------------- forget password by the user -----------------*/
    public async forgetPassword(body: any): Promise<UserModel> {
        this.log.info(`forget password by the user ${body}`)
        const isEmailExist = await this.userRepository.findOne({ email: body?.email });
        if (isEmailExist) {
            const password = await this.generateRandomPassword(12);
            isEmailExist.password = await UserModel.hashPassword(password);
            await AdminMail(body?.email, password)
            return await this.userRepository.save(isEmailExist)
        }
        throw new UserNotFoundError();
    }

    /* ----------------------------- send a email to users -----------*/
    public async sendEmailToUsers(body: any, res: any): Promise<UserModel | any> {
        const { senderId, receiverId, processId } = body;
        try {
            const userData = await this.userInfoById(senderId);
            const processData = await this.processService.processData(processId);
            processData['senderName'] = userData?.name;
            Promise.all(receiverId?.map(async (ele) => {
                const receiverData = await this.userInfoById(ele);
                await ProcessMail(receiverData.email, processData)
            }))
            return res.status(200).send({ success: true, MESSAGE: 'EMAIL_SUCCESSFULLY_SENT' })
        } catch (error) {
            throw error;
        }
    }

    /*   get user data bu user id */
    public async getUserData(userId: number): Promise<UserModel> {
        return await this.userRepository.findOne(userId)
    }


}