import { Exclude, Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupModel } from "./GroupModel";
import { UserModel } from "./UserModel";
import { ProcessModel } from "./ProcessModel";

@Entity({ name: 'task' })
export class TaskModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'group_id' })
    public groupId: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @IsNotEmpty()
    @Column({ name: 'description' })
    public description: string;

    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;

    @IsOptional()
    @Column({ name: 'process_id' })
    public processId: number;

    @IsOptional()
    @Column({ name: 'is_active' })
    public isActive: boolean;

    @IsOptional()
    @Column({ name: 'status' })
    public status: number;

    @IsOptional()
    @Column({ name: 'start_date' })
    public startDate: Date;
    
    @IsOptional()
    @Column({ name: 'is_recurren' })
    public isRecurren: boolean;

    @IsOptional()
    @Column({ name: 'end_date' })
    public endDate: Date;

    @IsOptional()
    @Column({ name: 'duration' })
    public duration: string;

    @IsOptional()
    @Column({ name: 'is_process' })
    public isProcess: boolean;

    @IsOptional()
    @Column({ name: 'is_day_task' })
    public isDayTask: boolean;

    @IsNotEmpty()
    @Column({ name: 'created_id' })
    public createdId: number;

    @IsNotEmpty()
    @Column({ name: 'remainder' })
    public remainder: string;

    @IsNotEmpty()
    @Column({ name: 'recurren_type' })
    public recurrenType: string;

    @IsNotEmpty()
    @Column({ name: 'recurren_start_date' })
    public recurrenStartDate: Date;

    @IsNotEmpty()
    @Column({ name: 'recurren_end_date' })
    public recurrenEndDate: Date;

    @Exclude({ toClassOnly: true })
    @CreateDateColumn({ name: 'created_at' })
    public readonly createdAt: Date;

    @Exclude({ toClassOnly: true })
    @CreateDateColumn({ name: 'updated_at' })
    public readonly updatedAt: Date;

    @Exclude({ toClassOnly: true })
    @CreateDateColumn({ name: 'deleted_at' })
    public readonly deletedAt: Date;

    @Type(() => GroupModel)
    @OneToOne(type => GroupModel, groupModel => groupModel.task, { cascade: true })
    @JoinColumn({ name: 'group_id' })
    public groupModel: GroupModel;

    @JoinColumn({ name: 'user_id' })
    @OneToOne(type => UserModel, userModel => userModel.id)
    public user: UserModel

    @JoinColumn({ name: 'process_id' })
    @OneToOne(type => ProcessModel, processModel => processModel.id)
    public process: ProcessModel;

    @Type(() =>UserModel )
    @OneToOne(type => UserModel, userModel => userModel.task, { cascade: true })
    @JoinColumn({ name: 'user_id' })
    public userModel: UserModel;

    @JoinColumn({ name: 'group_id' })
    @OneToOne(type => GroupModel, groupModel => groupModel.id)
    public group: GroupModel;
}