import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTask1720098303159 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE task ADD COLUMN is_process BOOLEAN DEFAULT FALSE AFTER duration`)
        await queryRunner.query(`ALTER TABLE task CHANGE COLUMN start_date start_date dateTime `)
        await queryRunner.query(`ALTER TABLE task CHANGE COLUMN end_date end_date dateTime `)
        await queryRunner.query(`ALTER TABLE task CHANGE COLUMN duration duration VARCHAR(255) `)
        await queryRunner.query(`ALTER TABLE task ADD COLUMN is_day_task BOOLEAN DEFAULT FALSE AFTER duration`)
        await queryRunner.query(`ALTER TABLE task ADD COLUMN remainder VARCHAR(255) AFTER duration`)
        await queryRunner.query(`ALTER TABLE task ADD COLUMN created_id INT(11) AFTER group_id`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE task DROP COLUMN is_process`)
        await queryRunner.query(`ALTER TABLE task DROP COLUMN start_date `)
        await queryRunner.query(`ALTER TABLE task DROP COLUMN end_date `)
        await queryRunner.query(`ALTER TABLE task DROP COLUMN duration `)
        await queryRunner.query(`ALTER TABLE task DROP COLUMN is_day_task `)
        await queryRunner.query(`ALTER TABLE task DROP COLUMN remainder`)
        await queryRunner.query(`ALTER TABLE task ADD COLUMN created_id`)
    }

}
