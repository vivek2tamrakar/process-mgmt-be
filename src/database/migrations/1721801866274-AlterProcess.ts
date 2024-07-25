import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProcess1721801866274 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE process ADD COLUMN is_review BOOLEAN DEFAULT FALSE AFTER description`)
        await queryRunner.query(`ALTER TABLE process ADD COLUMN review_date DATE AFTER description`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE process DROP COLUMN is_review`)
        await queryRunner.query(`ALTER TABLE process DROP COLUMN review_date`)
    }

}
