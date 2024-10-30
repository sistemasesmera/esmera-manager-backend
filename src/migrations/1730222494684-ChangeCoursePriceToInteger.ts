import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCoursePriceToInteger1730222494684
  implements MigrationInterface
{
  name = 'ChangeCoursePriceToInteger1730222494684';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Cambia el tipo de coursePrice de string a integer, convirtiendo automáticamente los valores existentes
    await queryRunner.query(
      `ALTER TABLE "contract" ALTER COLUMN "coursePrice" TYPE integer USING "coursePrice"::integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revertir el cambio de tipo a string, manteniendo los valores convertidos
    await queryRunner.query(
      `ALTER TABLE "contract" ALTER COLUMN "coursePrice" TYPE character varying USING "coursePrice"::text`,
    );
  }
}
