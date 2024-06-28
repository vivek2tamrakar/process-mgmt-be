import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { configure, format, transports } from 'winston';

import { env } from '../env';

export const winstonLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
    // console.log("----------------------------")
    configure({
        transports: [
            new transports.Console({
                level: env.log.level,
                handleExceptions: true,
                format: env.node !== 'development'
                    ? format.combine(
                        format.json()
                    )
                    : format.combine(
                        format.colorize(),
                        format.simple()
                    ),
            }),
        ],
    });
 
};

// import winston from 'winston';

// export const winstonLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => winston.createLogger({
//         level: env.log.level,
//         format: env.node !== 'development'
//             ? winston.format.combine(
//                 winston.format.json()
//             )
//             : winston.format.combine(
//                 winston.format.colorize(),
//                 winston.format.simple()
//             ),
//         transports: [
//             new winston.transports.Console({
//                 handleExceptions: true,
//             })
//         ],
//     });