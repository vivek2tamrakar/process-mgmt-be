import { UserRoles } from "../../api/enums/Users";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class users1717398888737 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'users',
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
                    name: 'email',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false,
                    isUnique: true,
                }, {
                    name: 'password',
                    length: '255',
                    type: 'varchar',
                    isPrimary: false,
                    isNullable: false,
                }, {
                    name: 'mobile_number',
                    type: 'varchar',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'created_by_id',
                    type: 'int',
                    isPrimary: false,
                    isNullable: true,
                }, {
                    name: 'role',
                    type: 'int',
                    isPrimary: false,
                    isNullable: true,
                    default: UserRoles.COMPANY
                }, {
                    name: 'is_active',
                    type: 'boolean',
                    isNullable: true,
                    isPrimary: false,
                    default: true
                }, {
                    name: 'fcm_token',
                    type: 'varchar',
                    isNullable: true,
                    isPrimary: false,
                    length: '255'
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
        await queryRunner.dropTable('users')
    }

}
