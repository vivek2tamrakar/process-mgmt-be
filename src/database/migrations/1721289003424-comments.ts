import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class comments1721289003424 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'comments',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    generationStrategy: 'increment',
                    isNullable: false,
                    isGenerated: true
                }, {
                    name: 'name',
                    type: 'varchar',
                    isPrimary: false,
                    isNullable: false,
                    length: '255'
                }, {
                    name: 'process_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'user_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: false,
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
        await queryRunner.dropTable('comments')
    }

}
