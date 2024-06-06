import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterUser1717664341136 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users CHANGE COLUMN password password VARCHAR(255) `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users DROP COLUMN password`)
    }

}
