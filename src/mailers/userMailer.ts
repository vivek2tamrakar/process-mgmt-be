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

export const assignMail = async (dbuser: any, data: any) => {
    let template = 'AssignMail'
    const helperOption = {
        from: env.email.userName,
        to: dbuser,
        subject: 'assign Mail',
        template,
        context: {
            data: data
        }
    };
    Transport().sendMail(helperOption, (error, info) => {
        if (error) {
            console.log(error)
        }
        console.log(info);
        return true;
    })
}


export const adminMail = async (adminMail, data) => {
    let template = 'AdminMail'
    const helperOptions = {
        from: env.email.userName,
        to: adminMail,
        template,
        subject: "send email to admin",
        context: {
            task: 'today task'
        },
        attachments: [
            {
                filename: 'task.xlsx',
                content: data,
                encoding: 'base64'
            }
        ]
    }
    Transport().sendMail(helperOptions, (err, userInfo) => {
        if (err) {
            console.log(err)
        }
        console.log(userInfo);
        return true
    })
}

export const reminderMail = (dbUser, data) => {
    let template = 'ReminderMail'
    const helperOptions = {
        from: env.email.userName,
        toString: dbUser,
        template,
        subject: 'your task is about to start',
        context: {
            data: data
        }
    }
    Transport().sendMail(helperOptions, (err, info) => {
        if (err) {
            console.log(err)
        }
        console.log(info)
        return true;
    })
}