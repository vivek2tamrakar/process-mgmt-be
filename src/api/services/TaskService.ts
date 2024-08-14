import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { TaskRepository } from "../repositories/TaskRepository";
import { TaskModel } from "../models/TaskModel";
import { TaskNotFound } from "../errors/Task";
import { AdminId, UserRoles } from "../enums/Users";
import { UserService } from "./UserService";
import { adminMail, reminderMail, TaskMail } from "../../mailers/userMailer";
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
        const date = new Date();

        const receiveDate = new Date(body?.startDate);
        const fomatedDate = new Date(receiveDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds()));
        const receieveEndDate = new Date(body?.endDate);
        const formatEndDate = new Date(receieveEndDate.setHours(date.getHours(), date.getMinutes(), date.getSeconds()));

        let modifyData = body?.userId?.map((ele) => {
            return {
                groupId: body?.groupId,
                name: body?.name,
                description: body?.description,
                userId: ele,
                processId: body?.processId,
                startDate: fomatedDate,
                endDate: formatEndDate,
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
            isTaskExist.isChecklist = body?.isChecklist;
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

    public async sendMailToAdmin(): Promise<TaskModel | any> {
        this.log.info('send an excel file to admin');
        const adminData = await this.userService.getUserData(AdminId.ID);
        const todayTask = await this.taskRepository.sendMailToAdmin();
        const workbook = new Excel.Workbook()
        const workSheet = workbook.addWorksheet('task');
        workSheet.columns = [
            { header: 'taskname', key: 'name' },
            { header: 'taskdescription', key: 'description' },
            { header: 'taskstatus', key: 'isActive' },
            { header: 'taskDuration', key: 'duration' },
            { header: 'taskRemainder', key: 'remainder' },
            { header: 'group', key: 'group' },
            { header: 'processName', key: 'process' },
            { header: 'processDescription', key: 'processDescription' },
            { header: 'userName', key: 'user' },
            { header: 'email', key: 'email' }
        ];
        todayTask.forEach(ele => {
            workSheet.addRow({
                name: ele?.name,
                description: ele?.description,
                isActive: ele?.isActive,
                duration: ele?.duration,
                remainder: ele?.remainder,
                group: ele?.group?.name,
                process: ele?.process?.name,
                processDescription: ele?.process?.description,
                user: ele?.user.name,
                email: ele?.user?.email
            })
        })
        const buffer = await workbook.xlsx.writeBuffer();
        await adminMail(adminData.email, buffer)
    }

    /* send remainder notification*/
    public async sendRemainderMail(): Promise<TaskModel | any> {
        this.log.info(`send  remainder notification`)
        const taskReminderData: any = await this.taskRepository.sendRemainderMail();
        if (taskReminderData?.length) {
            taskReminderData?.map((ele) => {
                const reminder = Number(ele?.remainder);
                const newStartDate = new Date();
                newStartDate.setMinutes(reminder + newStartDate.getMinutes());
                ele.startDate = newStartDate;
            })
            const result: any = await this.taskRepository.sendRemainder(taskReminderData);
            if (result?.length) {
                await Promise.all(result?.map(async (ele) => {
                    const userData = await this.userService.getUserData(ele?.userId)
                    ele.startDate = await this.formatDate(ele?.startDate);
                    ele.endDate = await this.formatDate(ele?.endDate)
                    await reminderMail(userData?.email, ele)
                }))
            }
        }
    }

    public async formatDate(dateString) {
        const date = new Date(dateString);
        return date.toDateString();
    };

    /* ------------------- get task data by task id ----------- */
    public async getTaskDataByTaskId(taskId: number): Promise<TaskModel> {
        this.log.info(`get task data by task id${taskId}`)
        return await this.taskRepository.getTaskDataByTaskId(taskId);
    }



}