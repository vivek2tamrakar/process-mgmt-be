import { HttpError } from 'routing-controllers';

export class UserNotFoundError extends HttpError {
    constructor() {
        super(404, 'ERROR.USER_NOT_FOUND ')
    }
}

export class UserError extends HttpError {
    constructor() {
        super(400, 'ERROR.BAD_REQUEST ')
    }
}
