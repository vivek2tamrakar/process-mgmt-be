import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterUser1720791347940 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users ADD COLUMN profile_pic VARCHAR(255) AFTER role `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users DROP TABLE profile_pic`)
    }

}
