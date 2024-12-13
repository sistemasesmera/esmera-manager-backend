import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMonthlyGoalIdToUUID1734106660550 implements MigrationInterface {
    name = 'UpdateMonthlyGoalIdToUUID1734106660550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_goal" DROP CONSTRAINT "PK_ab883a2c8ae7b0a625d5f59569e"`);
        await queryRunner.query(`ALTER TABLE "monthly_goal" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "monthly_goal" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "monthly_goal" ADD CONSTRAINT "PK_ab883a2c8ae7b0a625d5f59569e" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_goal" DROP CONSTRAINT "PK_ab883a2c8ae7b0a625d5f59569e"`);
        await queryRunner.query(`ALTER TABLE "monthly_goal" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "monthly_goal" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "monthly_goal" ADD CONSTRAINT "PK_ab883a2c8ae7b0a625d5f59569e" PRIMARY KEY ("id")`);
    }

}
