import { Exclude, Expose, Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FolderModel } from "./FolderModel";
import { GroupModel } from "./GroupModel";
import { StepModel } from "./StepModel";
import { AssignModel } from "./AssignModel";
import { UserModel } from "./UserModel";
import { CommentsModel } from "./CommentsModel";


@Entity({ name: 'process' })
export class ProcessModel extends BaseEntity {

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

    @IsOptional()
    @Column({ name: 'folder_id' })
    public folderId: number;

    @IsNotEmpty()
    @Column({ name: 'tags' })
    public tags: string;

    @IsNotEmpty()
    @Column({ name: 'description' })
    public description: string;

    @Exclude()
    @Exclude({ toClassOnly: true })
    @DeleteDateColumn({ name: 'deleted_at' })
    public readonly deletedAt?: Date;

    @Exclude({ toClassOnly: true })
    @CreateDateColumn({ name: 'created_at' })
    public readonly createdAt: Date;

    @Exclude({ toClassOnly: true })
    @UpdateDateColumn({ name: 'updated_at' })
    public updatedAt: Date;


    @Type(() => FolderModel)
    @OneToOne(type => FolderModel, FolderModel => FolderModel.process, { cascade: true })
    @JoinColumn({ name: 'folder_id' })
    public folderModel: FolderModel;

    @Type(() => GroupModel)
    @OneToOne(type => GroupModel, groupModel => groupModel.proces, { cascade: true })
    @JoinColumn({ name: 'group_id' })
    public processModel: GroupModel;

    @Type(() => StepModel)
    @Expose()
    @OneToMany(type => StepModel, stepModel => stepModel.process)
    public step: StepModel;

    @Type(() => AssignModel)
    @Expose()
    @OneToMany(type => AssignModel, assignModel => assignModel.processModel)
    public assign: AssignModel;

    @JoinColumn({ name: 'group_id' })
    @OneToOne(type => GroupModel, groupModel => groupModel.id)
    public group: GroupModel;

    @JoinColumn({ name: 'folder_id' })
    @OneToOne(type => FolderModel, folderModel => folderModel.id)
    public folder: FolderModel;

    @JoinColumn({ name: 'user_id' })
    @OneToOne(type => UserModel, userModel => userModel.id)
    public user: UserModel;

    @Type(() => CommentsModel)
    @Expose()
    @OneToMany(type => CommentsModel, commentsModel => commentsModel.processModel)
    public comment: CommentsModel;
}