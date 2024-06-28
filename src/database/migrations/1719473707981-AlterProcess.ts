import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterProcess1719473707981 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE process CHANGE COLUMN tags tags TEXT`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE process DROP COLUMN step`)

    }

}
