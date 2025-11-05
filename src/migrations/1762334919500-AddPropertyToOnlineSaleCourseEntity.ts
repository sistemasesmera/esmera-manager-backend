import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPropertyToOnlineSaleCourseEntity1762334919500 implements MigrationInterface {
    name = 'AddPropertyToOnlineSaleCourseEntity1762334919500'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "online_sale_course" ADD "ref_code" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "online_sale_course" ADD "commercial_id" uuid`);
        await queryRunner.query(`ALTER TABLE "online_sale_course" ADD CONSTRAINT "FK_0d400bec63d2cfd6132be3499e8" FOREIGN KEY ("commercial_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "online_sale_course" DROP CONSTRAINT "FK_0d400bec63d2cfd6132be3499e8"`);
        await queryRunner.query(`ALTER TABLE "online_sale_course" DROP COLUMN "commercial_id"`);
        await queryRunner.query(`ALTER TABLE "online_sale_course" DROP COLUMN "ref_code"`);
    }

}
