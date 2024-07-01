import { Exclude, Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProcessModel } from "./ProcessModel";

@Entity({ name: 'step' })
export class StepModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'process_id' })
    public processId: number;

    @IsNotEmpty()
    @Column({ name: 'step_description' })
    public stepDescription: string;

    @IsOptional()
    @Column({ name: 'is_completed' })
    public isCompleted: boolean;

    @Exclude({ toClassOnly: true })
    @CreateDateColumn({ name: 'created_at' })
    public readonly createdAt: Date;

    @Exclude({ toClassOnly: true })
    @CreateDateColumn({ name: 'updated_at' })
    public readonly updatedAt: Date;

    @Exclude({ toClassOnly: true })
    @CreateDateColumn({ name: 'deleted_at' })
    public readonly deletedAt: Date;

    @Type(() => ProcessModel)
    @OneToOne(type => ProcessModel, processModel => processModel.step, { cascade: true })
    @JoinColumn({ name: 'process_id' })
    public process: ProcessModel;


}