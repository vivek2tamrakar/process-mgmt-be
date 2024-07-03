import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupModel } from "./GroupModel";
import { ProcessModel } from "./ProcessModel";
import { AssignModel } from "./AssignModel";


@Entity({ name: 'folder' })
export class FolderModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'name' })
    public name: string;

    @IsOptional()
    @Column({ name: 'user_id' })
    public userId: number;

    @IsOptional()
    @Column({ name: 'group_id' })
    public groupId: number;

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

    @Type(() => GroupModel)
    @OneToOne(type => GroupModel, groupModel => groupModel.folder, { cascade: true })
    @JoinColumn({ name: 'group_id' })
    public groupModel: GroupModel;

    @Type(() => ProcessModel)
    @Expose()
    @OneToMany(type => ProcessModel, processModel => processModel.folderModel)
    public process: ProcessModel;

    @Type(() => AssignModel)
    @Expose()
    @OneToMany(type => AssignModel, assignModel => assignModel.folderModel)
    public assign: AssignModel;

}