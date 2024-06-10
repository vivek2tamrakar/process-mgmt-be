import { env } from '../env';
import { Transport } from './index';

export const AdminMail = (dbUser: any, data?: any) => {
    let template;
    template = 'userMail';
    const helperOptions = {
        from: env.email.userName,
        to: dbUser,
        subject: 'INVITATION',
        template,
        context: {
            token: `http://${env.app.host}:${env.app.port}/api/users/verify/${data}`,
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


