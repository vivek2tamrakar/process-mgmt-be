import { env } from '../env';
import { Transport } from './index';

export const AdminMail = async (dbUser: any, data?: any) => {
    console.log('data', data);
    let template;
    template = 'userMail';
    const helperOptions = {
        from: env.email.userName,
        to: dbUser,
        subject: 'INVITATION',
        template,
        context: {
            // token: `http://${env.app.host}:${env.app.port}/api/users/verify/${data}`,
            token: data
        }
    };
    Transport().sendMail(helperOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        console.log('email is send');
        console.log(info);
        return true;
    });
};

export const ProcessMail = async (dbUser: any, data?: any) => {
    console.log('data', data);
    let template;
    template = 'processMail';
    const helperOptions = {
        from: env.email.userName,
        to: dbUser,
        subject: 'process ',
        template,
        context: {
            data: data
        }
    };
    Transport().sendMail(helperOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        console.log('email is send');
        console.log(info);
        return true;
    });
};

export const TaskMail = async (dbUser: any, data?: any) => {
    let template;
    template = 'TaskMail';
    const helperOptions = {
        from: env.email.userName,
        to: dbUser,
        subject: 'Task Assign Mail',
        template,
        context: {
            task: 'Your assigned task details here'
        },
        attachments: [
            {
                filename: 'task.xlsx',
                content: data,
                encoding: 'base64'
            }
        ]
    };
    Transport().sendMail(helperOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        console.log('email is send');
        console.log(info);
        return true;
    });
};

