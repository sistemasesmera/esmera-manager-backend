import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveToCourse1774692818310 implements MigrationInterface {
    name = 'AddIsActiveToCourse1774692818310'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "isActive"`);
    }

}
