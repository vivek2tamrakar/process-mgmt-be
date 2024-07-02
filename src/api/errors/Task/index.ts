import { HttpError } from "routing-controllers";

export class TaskNotFound extends HttpError {

    constructor() {
        super(404, 'TASK_ID_NOT_FOUND');
    }
}