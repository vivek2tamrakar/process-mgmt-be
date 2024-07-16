import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTask1721135923198 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE task ADD COLUMN is_recurren BOOLEAN DEFAULT TRUE AFTER is_process`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE task ADD COLUMN is_recurren`)
    }

}
