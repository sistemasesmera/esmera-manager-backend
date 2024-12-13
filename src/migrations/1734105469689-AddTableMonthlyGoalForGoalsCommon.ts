import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTableMonthlyGoalForGoalsCommon1734105469689
  implements MigrationInterface
{
  name = 'AddTableMonthlyGoalForGoalsCommon1734105469689';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "monthly_goal" ("id" SERIAL NOT NULL, "month_year" character varying NOT NULL, "common_goal" integer NOT NULL, "contracts_goal" integer NOT NULL, "holidays" json, "days_in_month" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0a4624acb5b2a89bb4e8c093a71" UNIQUE ("month_year"), CONSTRAINT "PK_ab883a2c8ae7b0a625d5f59569e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "monthly_goal"`);
  }
}
