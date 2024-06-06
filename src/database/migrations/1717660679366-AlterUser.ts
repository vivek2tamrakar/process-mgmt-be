import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUser1717660679366 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users CHANGE COLUMN name name VARCHAR(255) `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users DROP COLUMN name`)
    }

}
