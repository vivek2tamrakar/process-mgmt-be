import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStep1719810778588 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE step ADD COLUMN is_completed BOOLEAN DEFAULT FALSE AFTER step_description`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE step DROP COLUMN is_completed`)
    }

}
