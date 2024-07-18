import { HttpError } from "routing-controllers";

export class CommentError extends HttpError {
    constructor() {
        super(406, 'COMMENT_ALREADY_EXIST');
    } 
}