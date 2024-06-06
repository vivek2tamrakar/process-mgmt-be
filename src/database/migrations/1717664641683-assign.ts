import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class assign1717664641683 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'assign',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isNullable: false,
                    isGenerated: true,
                    generationStrategy: 'increment',
                }, {
                    name: 'user_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'assign_user_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'group_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'folder_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: true,
                },{
                    name: 'process_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: true,
                }, {
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
        await queryRunner.dropTable('assign')
    }

}
