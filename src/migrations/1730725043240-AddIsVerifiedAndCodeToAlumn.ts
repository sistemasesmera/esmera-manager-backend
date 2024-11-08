import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsVerifiedAndCodeToAlumn1730725043240
  implements MigrationInterface
{
  name = 'AddIsVerifiedAndCodeToAlumn1730725043240';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "alumn" ADD "isVerified" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "alumn" ADD "code" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "alumn" DROP COLUMN "code"`);
    await queryRunner.query(`ALTER TABLE "alumn" DROP COLUMN "isVerified"`);
  }
}
