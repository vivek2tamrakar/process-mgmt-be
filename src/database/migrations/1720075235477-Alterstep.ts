import { MigrationInterface, QueryRunner } from "typeorm";

export class Alterstep1720075235477 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE step ADD COLUMN last_review dateTime AFTER is_completed`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE step DROP COLUMN last_review`)
    }

}
