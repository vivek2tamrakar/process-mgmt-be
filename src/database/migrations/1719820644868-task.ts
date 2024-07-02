import { TaskManager } from "../../api/enums/TaskManager";
import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class task1719820644868 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'task',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isNullable: false
                }, {
                    name: 'group_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'name',
                    type: 'varchar',
                    isPrimary: false,
                    isNullable: false,
                    length: '255'
                }, {
                    name: 'description',
                    type: 'varchar',
                    isPrimary: false,
                    isNullable: false,
                    length: '255'
                }, {
                    name: 'user_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'process_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'status',
                    type: 'int',
                    isPrimary: false,
                    isNullable: true,
                    default: TaskManager.BLACK
                }, {
                    name: 'start_date',
                    type: 'datetime',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'end_date',
                    type: 'datetime',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'duration',
                    type: 'varchar',
                    isPrimary: false,
                    isNullable: false,
                    length: '255'
                }, {
                    name: 'created_at',
                    type: 'timestamp',
                    isNullable: true,
                    isPrimary: false,
                    default: 'CURRENT_TIMESTAMP'
                }, {
                    name: 'updated_at',
                    type: 'timestamp',
                    isPrimary: false,
                    isNullable: true,
                    default: 'CURRENT_TIMESTAMP'
                }, {
                    name: 'deleted_at',
                    type: 'timestamp',
                    isPrimary: false,
                    isNullable: true,
                }
            ]
        })
        await queryRunner.createTable(table)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('task')
    }

}
