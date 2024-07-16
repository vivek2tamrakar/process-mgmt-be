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
 
        if (env.app.runCron) {
            firstCronJob.start()
        }

    }
};
