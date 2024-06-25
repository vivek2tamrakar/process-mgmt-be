import { IsNotEmpty } from "class-validator";

export class folderReq {

    @IsNotEmpty()
    public name:string;

    @IsNotEmpty()
    public userId:number;
}