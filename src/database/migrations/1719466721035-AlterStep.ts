import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterStep1719466721035 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE step DROP COLUMN step`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE step DROP COLUMN step`)
    }

}
