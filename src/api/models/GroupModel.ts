import { Exclude } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
} 