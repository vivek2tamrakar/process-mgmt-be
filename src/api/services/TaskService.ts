import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskModel } from "../models/TaskModel";
import { TaskNotFound } from "../errors/Task";
import { UserRoles } from "../enums/Users";
import { UserService } from "./UserService";
import { TaskMail } from "../../mailers/userMailer";
import Excel from 'exceljs';

@Service()
export class TaskService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @Service() private userService: UserService,
        @OrmRepository() private taskRepository: TaskRepository,
    ) {
    }

    /* ----------------------add  task  ------------ */
    public async addTask(body: any): Promise<TaskModel> {
        this.log.info(`add task`)
        let modifyData = body?.userId?.map((ele) => {
            return {
                groupId: body?.groupId,
                name: body?.name,
                description: body?.description,
                userId: ele,
                processId: body?.processId,
                startDate: body?.startDate,
                endDate: body?.endDate,
                duration: body?.duration,
                isProcess: body?.isProcess,
                isDayTask: body?.isDayTask,
                remainder: body?.remainder,
                createdId: body?.createdId,
                recurrenType: body?.recurrenType,
                recurrenStartDate: body?.recurrenStartDate,
                recurrenEndDate: body?.recurrenEndDate
            }
        })
        return await this.taskRepository.save(modifyData);
    }

    /* ----------------------update task  ------------ */
    public async updateTask(body, roleId: number): Promise<TaskModel> {
        this.log.info(`update task`)
        let isTaskExist = await this.taskRepository.findOne({ id: body?.id });
        if (!isTaskExist) throw new TaskNotFound()
        isTaskExist.status = body?.status;
        if (roleId == UserRoles.TASKMANAGER || roleId == UserRoles.ADMIN || roleId == UserRoles.MANAGER || UserRoles.COMPANY) {
            isTaskExist.isActive = body?.isActive;
            isTaskExist.name = body?.name;
            isTaskExist.description = body?.description;
            isTaskExist.userId = body?.userId;
            isTaskExist.processId = body?.processId;
            isTaskExist.startDate = body?.startDate;
            isTaskExist.endDate = body?.endDate;
            isTaskExist.duration = body?.duration;
        }
        return await this.taskRepository.save(isTaskExist);
    }

    /* ---------------------- delete task ------------ */
    public async deleteTask(taskId: number, res: any): Promise<TaskModel> {
        this.log.info(`delete task by ${taskId}`)
        await this.taskRepository.softDelete({ id: taskId })
        return res.status(200).send({ sucess: true, MESSAGE: 'SUCCESSFULLY_DELETE' })
    }

    /* ---------------------- createTaskWithCron task ------------ */
    public async createTaskWithCron() {
        this.log.info(`createTaskWithCron`)
        await this.taskRepository.createTaskWithCron();
    }

    /* ------------------- get assign and create task ----------- */
    public async getTaskByUserId(userId: number, param: any): Promise<TaskModel[]> {
        this.log.info(`get task whose create by the user and assign to this user ${userId}`)
        return await this.taskRepository.getTaskByUserId(userId, param);
    }

    /* -------------------------send email ---------------------- */
    public async sendEmail(userId: number, res: any, param: any): Promise<TaskModel[] | any> {
        this.log.info(`send email to this user`)
        try {
            const userData = await this.userService.userInfoById(userId);
            const taskData = await this.taskRepository.sendEmail(userId, param);
            var workbook = new Excel.Workbook();
            var worksheet = workbook.addWorksheet('task_Sheet')
            worksheet.columns = [
                { header: 'name', key: 'name' },
                { header: 'description ', key: 'description ' },
                { header: 'start_date', key: 'startDate' },
                { header: 'duration', key: 'duration' },
                { header: 'end_date', key: 'endDate' },
                { header: 'is_day_task:', key: 'isDayTask:' }
            ]
            taskData?.forEach(ele => {
                worksheet.addRow({
                    name: ele?.name,
                    description: ele?.description,
                    startDate: ele?.startDate,
                    duration: ele?.duration,
                    endDate: ele?.endDate,
                    isDayTask: ele?.isDayTask
                });
            });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=' + 'task.xlsx');

            const buffer = await workbook.xlsx.writeBuffer();
            await TaskMail(userData?.email, buffer)
            return res.status(200).send({ success: true, MESSAGE: 'EMAIL_SUCCESSFULLY_SENT' })
        } catch (error) {
            throw error
        }

    }

}