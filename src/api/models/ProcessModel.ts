import { Exclude, Type } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FolderModel } from "./FolderModel";
import { GroupModel } from "./GroupModel";


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
    @OneToOne(type => FolderModel, FolderModel => FolderModel.process, { cascade: true })
    @JoinColumn({ name: 'folder_id' })
    public folderModel: FolderModel;

    @Type(() => GroupModel)
    @OneToOne(type => GroupModel, groupModel => groupModel.proces, { cascade: true })
    @JoinColumn({ name: 'group_id' })
    public processModel: GroupModel;
}