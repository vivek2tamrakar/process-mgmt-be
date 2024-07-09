import { HttpError } from "routing-controllers";

export class ProcessAlreadyError extends HttpError {

    constructor() {
        super(406, 'PROCESS_NAME_ALREADY_EXIST');
    }
}

export class ProcessNotFound extends HttpError {

    constructor() {
        super(404, 'PROCESS_ID_NOT_FOUND');
    }
}