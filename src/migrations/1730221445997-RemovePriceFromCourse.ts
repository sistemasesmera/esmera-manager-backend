import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovePriceFromCourse1730221445997 implements MigrationInterface {
  name = 'RemovePriceFromCourse1730221445997';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "course" DROP COLUMN "price"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course" ADD "price" character varying(20) NOT NULL`,
    );
  }
}
