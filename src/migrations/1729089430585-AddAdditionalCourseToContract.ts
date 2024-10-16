import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdditionalCourseToContract1729089430585
  implements MigrationInterface
{
  name = 'AddAdditionalCourseToContract1729089430585';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract" ADD "additionalCourse" text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract" DROP COLUMN "additionalCourse"`,
    );
  }
}
