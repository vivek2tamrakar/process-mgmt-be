import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class steps1718101922612 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'step',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                    isNullable: false
                }, {
                    name: 'process_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'step',
                    type: 'varchar',
                    isPrimary: false,
                    isNullable: false,
                    length: '255'
                }, {
                    name: 'step_description',
                    type: 'text',
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
        await queryRunner.dropTable('step')
    }

}
