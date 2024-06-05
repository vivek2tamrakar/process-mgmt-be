import { bootstrapMicroframework } from 'microframework-w3tec';
import { banner } from './lib/banner';
import { Logger } from './lib/logger';
import { eventDispatchLoader } from './loaders/eventDispatchLoader';
import { expressLoader } from './loaders/expressLoader';
import { homeLoader } from './loaders/homeLoader';
import { iocLoader } from './loaders/iocLoader';
import { publicLoader } from './loaders/publicLoader';

import { typeormLoader } from './loaders/typeormLoader'; // database connectivity
import { winstonLoader } from './loaders/winstonLoader';
// @ts-ignore
import { env } from './env';

/**
 * EXPRESS TYPESCRIPT APP
 * ----------------------------------------
 *
 * This is a app for Node.js Application written in TypeScript.
 * The basic layer of this app is express. For further information visit
 * the 'README.md' file.
 */
const log = new Logger(__filename);

bootstrapMicroframework({
    /**
     * Loader is a place where you can configure all your modules during microframework
     * bootstrap process. All loaders are executed one by one in a sequential order.
     */
    loaders: env.app.isCron ? [
        winstonLoader,
        iocLoader,
        eventDispatchLoader,
        typeormLoader,
        expressLoader,
        homeLoader,
        publicLoader,
    ] : [
        winstonLoader,
        iocLoader,
        eventDispatchLoader,
        typeormLoader,
        expressLoader,
        homeLoader,
        publicLoader,
    ],
})
    .then(() => banner(log))
    .catch(error => log.error('Application is crashed: ' + error));
    