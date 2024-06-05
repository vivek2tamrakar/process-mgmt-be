import { Exclude } from "class-transformer";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity({name:'folder'})
export class FolderModel extends BaseEntity {

    @PrimaryGeneratedColumn()
    public id:number;

    @IsNotEmpty()
    @Column({name:'name'})
    public name:string;

    @IsOptional()
    @Column({name:'user_id'})
    public userId:number;

    @IsOptional()
    @Column({name:'group_id'})
    public groupId:number;

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