import { Exclude, Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ProcessModel } from "./ProcessModel";
import { UserModel } from "./UserModel";

@Entity({ name: 'comments' })
export class CommentsModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @IsNotEmpty()
    @Column({ name: 'process_id' })
    public processId: number;

    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;

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

    @Type(() => ProcessModel)
    @OneToOne(type => ProcessModel, processModel => processModel.comment, { cascade: true })
    @JoinColumn({ name: 'process_id' })
    public processModel: ProcessModel;

    @JoinColumn({ name: 'user_id' })
    @OneToOne(type => UserModel, userModel => userModel.id)
    public user: UserModel;
}