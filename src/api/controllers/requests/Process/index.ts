import { IsNotEmpty, IsOptional } from "class-validator";

export class ProcessReq {

    @IsNotEmpty()
    public name:String;

    @IsNotEmpty()
    public userId:number;

    @IsOptional()
    public tag:string;

    @IsOptional()
    public description:string;
}