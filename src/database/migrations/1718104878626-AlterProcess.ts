import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterProcess1718104878626 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE process ADD COLUMN description VARCHAR(255) AFTER folder_id`)
        await queryRunner.query(`ALTER TABLE process ADD COLUMN tags VARCHAR(255) AFTER folder_id`)

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE process DROP COLUMN description`)
        await queryRunner.query(`ALTER TABLE process DROP COLUMN tags`)

    }

}
