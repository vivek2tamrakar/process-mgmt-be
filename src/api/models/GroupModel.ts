import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FolderModel } from "./FolderModel";
import { AssignModel } from "./AssignModel";
import { ProcessModel } from "./ProcessModel";

@Entity({name:'group'})
export class GroupModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id:number;

    @IsNotEmpty()
    @Column({name:'name'})
    public name:string;

    @IsNotEmpty()
    @Column({name:'user_id'})
    public userId:number;

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

    @Type(() => FolderModel)
    @Expose()
    @OneToMany(type => FolderModel, folderModel => folderModel.groupModel)
    public folder: FolderModel;

    @Type(() => AssignModel)
    @Expose()
    @OneToMany(type => AssignModel, assignModel => assignModel.groupmodel)
    public assign: AssignModel;

    @Type(() => ProcessModel)
    @Expose()
    @OneToMany(type => ProcessModel, processModel => processModel.processModel)
    public proces: ProcessModel;
} 