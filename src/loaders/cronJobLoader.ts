import * as cron from 'cron';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Container } from 'typedi';
import { env } from '../env';
import { TaskService } from '../api/services/TaskService';

export const cronJobLoader: MicroframeworkLoader = async (settings: MicroframeworkSettings | undefined) => {
    if (settings) {
        // return;
        const taskService = Container.get(TaskService);

        /* ----------  first cron job on every day at  12 pm -----------*/
        const firstCronJob = new cron.CronJob(`0 12 * * *`, async () => {
            await taskService.createTaskWithCron();
        });


        /* run a cron every day at 9pm  */
        const secondCron = new cron.CronJob(`0 21 * * * `, async () => {
            await taskService.sendMailToAdmin();
        })

        const thirdCron = new cron.CronJob(`* * * * *`, async () => {
            await taskService.sendRemainderMail()
        })

        if (env.app.runCron) {
            firstCronJob.start();
            secondCron.start()
            thirdCron.start()
        }

    }
};
