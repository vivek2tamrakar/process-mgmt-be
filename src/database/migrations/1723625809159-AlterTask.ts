import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTask1723625809159 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE task ADD COLUMN is_checklist BOOLEAN DEFAULT false AFTER process_id`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE task DROP COLUMN is_checklist`)
    }

}
