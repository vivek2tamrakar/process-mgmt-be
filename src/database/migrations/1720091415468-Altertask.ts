import {MigrationInterface, QueryRunner} from "typeorm";

export class Altertask1720091415468 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE task ADD COLUMN is_active BOOLEAN DEFAULT TRUE AFTER status`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE task DROP COLUMN is_active`)
    }

}
