import { HttpError } from "routing-controllers";

export class GroupError extends HttpError{

    constructor(){
        super(406, 'GROUP_NAME_ALREADY_EXIST');
    }
}