import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeOnlineSaleCourseTable1761757341960 implements MigrationInterface {
    name = 'ChangeOnlineSaleCourseTable1761757341960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "online_sale_course" DROP COLUMN "paymentStatus"`);
        await queryRunner.query(`DROP TYPE "public"."online_sale_course_paymentstatus_enum"`);
        await queryRunner.query(`ALTER TABLE "online_sale_course" ADD "practiceMode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "online_sale_course" ADD "modality" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "online_sale_course" DROP COLUMN "modality"`);
        await queryRunner.query(`ALTER TABLE "online_sale_course" DROP COLUMN "practiceMode"`);
        await queryRunner.query(`CREATE TYPE "public"."online_sale_course_paymentstatus_enum" AS ENUM('pending', 'paid', 'failed')`);
        await queryRunner.query(`ALTER TABLE "online_sale_course" ADD "paymentStatus" "public"."online_sale_course_paymentstatus_enum" NOT NULL DEFAULT 'pending'`);
    }

}
