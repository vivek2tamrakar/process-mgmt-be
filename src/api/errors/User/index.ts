import { HttpError } from 'routing-controllers';

export class RefreshTokenError extends HttpError {
    constructor() {
        super(401, 'TOKEN.ERRORS.REFRESH_TOKEN_IS_NOT_CORRECT');
    }
}

export class UserError extends HttpError {

    constructor() {
        super(406, 'MOBILE_NUMBER_ALREADY_EXIST');
    }
}


export class CompanyError extends HttpError {

    constructor() {
        super(406, 'COMPANY_NAME_ALREADY_EXIST');
    }
}

export class LoginError extends HttpError {
    constructor() {
        super(400, 'CAN_NOT_LOGIN')
    }

}