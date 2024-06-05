import  {IsNotEmpty} from 'class-validator';


export class BaseUser {
    @IsNotEmpty()
    public email: string;



    @IsNotEmpty()
    public createdAt: Date;

    @IsNotEmpty()
    public updatedAt: Date;

}
export class UserResponse extends BaseUser {
    public id: number;
}


