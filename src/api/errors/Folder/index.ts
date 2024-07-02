import { HttpError } from "routing-controllers";

export class FolderAlreadyError extends HttpError {

    constructor() {
        super(406, 'FOLDER_NAME_ALREADY_EXIST');
    }
}