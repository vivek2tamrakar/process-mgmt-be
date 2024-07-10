import { Exclude, Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { GroupModel } from "./GroupModel";
import { UserModel } from "./UserModel";
import { FolderModel } from "./FolderModel";
import { ProcessModel } from "./ProcessModel";

@Entity({ name: 'assign' })
export class AssignModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id: number;

    @IsNotEmpty()
    @Column({ name: 'user_id' })
    public userId: number;

    @IsNotEmpty()
    @Column({ name: 'assign_user_id' })
    public assignUserId: number;

    @IsOptional()
    @Column({ name: 'group_id' })
    public groupId: number;

    @IsOptional()
    @Column({ name: 'folder_id' })
    public folderId: number;

    @IsOptional()
    @Column({ name: 'process_id' })
    public processId: number;

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
    @OneToOne(type => GroupModel, groupModel => groupModel.assign, { cascade: true })
    @JoinColumn({ name: 'group_id' })
    public groupmodel: GroupModel;

    @JoinColumn({ name: 'assign_user_id' })
    @OneToOne(type => UserModel, userModel => userModel.id)
    public user: UserModel

    @Type(() => FolderModel)
    @OneToOne(type => FolderModel, folderModel => folderModel.assign, { cascade: true })
    @JoinColumn({ name: 'folder_id' })
    public folderModel: FolderModel;

    @Type(() => ProcessModel)
    @OneToOne(type => ProcessModel, processModel => processModel.assign, { cascade: true })
    @JoinColumn({ name: 'process_id' })
    public processModel: ProcessModel;

    @JoinColumn({ name: 'group_id' })
    @OneToOne(type => GroupModel, groupModel => groupModel.id)
    public group: GroupModel

    @JoinColumn({ name: 'process_id' })
    @OneToOne(type => ProcessModel, processModel => processModel.id)
    public process: ProcessModel;

} 