import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOnlineSaleCourseTable1761584823452
  implements MigrationInterface
{
  name = 'CreateOnlineSaleCourseTable1761584823452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."online_sale_course_paymentstatus_enum" AS ENUM('pending', 'paid', 'failed')`,
    );
    await queryRunner.query(
      `CREATE TABLE "online_sale_course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lastName" character varying NOT NULL, "nameCourse" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying, "amount" numeric(10,2) NOT NULL, "paymentStatus" "public"."online_sale_course_paymentstatus_enum" NOT NULL DEFAULT 'pending', "paymentReference" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0a443df60982ec0c7e442670f19" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "online_sale_course"`);
    await queryRunner.query(
      `DROP TYPE "public"."online_sale_course_paymentstatus_enum"`,
    );
  }
}
