import { IsNotEmpty } from "class-validator";

export class companyReq {

    @IsNotEmpty()
    public name: string;

    @IsNotEmpty()
    public email: string;

    @IsNotEmpty()
    public password: string;
}