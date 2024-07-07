import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTask1720173936874 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE task ADD COLUMN recurren_type VARCHAR(255) AFTER is_process`)
        await queryRunner.query(`ALTER TABLE task ADD COLUMN recurren_start_date dateTime AFTER recurren_type`)
        await queryRunner.query(`ALTER TABLE task ADD COLUMN recurren_end_date dateTime AFTER recurren_start_date`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE task DROP COLUMN recurren_type`)
        await queryRunner.query(`ALTER TABLE task DROP COLUMN recurren_start_date `)
        await queryRunner.query(`ALTER TABLE task DROP COLUMN recurren_end_date `)
    }

}
