import {
    IsEmail,  IsNotEmpty, IsOptional, IsString,   
} from 'class-validator';

export class LoginRequest {
    @IsEmail()
    @IsNotEmpty()
    public username: string;

    @IsNotEmpty()
    public password: string;

    @IsOptional()
    public mobileNumber: string;

}



export class RefreshTokenRequest {
    @IsEmail()
    @IsString()
    public refreshToken: string;
}







