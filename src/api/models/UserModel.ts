import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity,PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { Exclude } from "class-transformer";
import * as bcrypt from 'bcrypt';

@Entity({name:'users'})
@Unique(['email'])
export class UserModel extends BaseEntity {

    public static hashPassword(password: string): Promise<string> {
        return new Promise((resolve, reject) => {
            bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    }

    public static comparePassword(user: UserModel, password: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                resolve(res === true);
            });
        });
    }

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @IsNotEmpty()
    @IsEmail()
    @Column({ name: 'email' })
    public email: string;
 
    @IsNotEmpty()
    @Column({ name: 'password' })
    public password: string;

    @IsOptional()
    @Column({ name: 'created_by_id' })
    public createdById: number;

    @IsOptional()
    @Column({ name: 'is_active' })
    public isActive: boolean;

    @IsOptional()
    @Column({ name: 'fcm_token' })
    public fcmToken: string;

    @IsNotEmpty()
    @Column({ name: 'mobile_number' })
    public mobileNumber: string;

    @IsNotEmpty()
    @Column({ name: 'role' })
    public role: number;

    @Exclude()
    @Exclude({ toClassOnly: true })
    @DeleteDateColumn({ name: 'deleted_at' })
    public readonly deletedAt?: Date;

    @Exclude({ toClassOnly: true })
    @CreateDateColumn({ name: 'created_at' })
    public readonly createdAt: Date;

    @Exclude({ toClassOnly: true })
    @UpdateDateColumn({ name: 'updated_at' })
    public readonly updatedAt: Date;

}
