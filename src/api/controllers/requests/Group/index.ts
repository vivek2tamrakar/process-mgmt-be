import { IsNotEmpty } from "class-validator";

export class GroupReq {

    @IsNotEmpty()
    public name:string;

}