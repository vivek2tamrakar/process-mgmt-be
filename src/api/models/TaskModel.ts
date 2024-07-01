import { Exclude, Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { GroupModel } from "./GroupModel";

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
    @Column({ name: 'status' })
    public status: number;

    @IsNotEmpty()
    @Column({ name: 'start_date' })
    public startDate: Date;

    @IsOptional()
    @Column({ name: 'end_date' })
    public endDate: Date;

    @IsNotEmpty()
    @Column({ name: 'duration' })
    public duration: string;

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

}