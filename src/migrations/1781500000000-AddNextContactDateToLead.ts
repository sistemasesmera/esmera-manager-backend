import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNextContactDateToLead1781500000000 implements MigrationInterface {
  name = 'AddNextContactDateToLead1781500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" ADD COLUMN "nextContactDate" TIMESTAMP NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lead" DROP COLUMN "nextContactDate"`,
    );
  }
}
