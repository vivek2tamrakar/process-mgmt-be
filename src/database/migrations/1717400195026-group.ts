import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class group1717400195026 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table =new Table({
            name:'group',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: 'increment',
                }, {
                    name: 'name',
                    type: 'varchar',
                    isPrimary: false,
                    isNullable: false,
                    length: '255',
                }, {
                    name: 'user_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: false,
                },  {
                    name: 'created_at',
                    type: 'timestamp',
                    isPrimary: false,
                    isNullable: false,
                    default: 'CURRENT_TIMESTAMP',
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
                },
            ],
        })
        await queryRunner.createTable(table)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('group')
    }

}
