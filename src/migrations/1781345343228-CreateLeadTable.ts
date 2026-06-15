import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLeadTable1781345343228 implements MigrationInterface {
    name = 'CreateLeadTable1781345343228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."lead_source_enum" AS ENUM('WEB', 'WEB_ONLINE', 'MANUAL', 'META_ADS')`);
        await queryRunner.query(`CREATE TYPE "public"."lead_categorycourse_enum" AS ENUM('ESTETICA', 'PELUQUERIA', 'MAQUILLAJE', 'BARBERIA', 'UÑAS', 'CEJASYPESTANAS', 'SIN GESTION')`);
        await queryRunner.query(`CREATE TYPE "public"."lead_status_enum" AS ENUM('NUEVO', 'CONTACTADO', 'EN_SEGUIMIENTO', 'MATRICULADO', 'DESCARTADO')`);
        await queryRunner.query(`CREATE TYPE "public"."lead_discardreason_enum" AS ENUM('NO_RESPONDE', 'SIN_PRESUPUESTO', 'NO_INTERESADO', 'YA_MATRICULADO_OTRO', 'DATOS_INCORRECTOS', 'OTRO')`);
        await queryRunner.query(`CREATE TABLE "lead" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "phone" character varying(20) NOT NULL, "email" character varying, "source" "public"."lead_source_enum" NOT NULL DEFAULT 'WEB', "nameCourse" character varying, "categoryCourse" "public"."lead_categorycourse_enum", "status" "public"."lead_status_enum" NOT NULL DEFAULT 'NUEVO', "discardReason" "public"."lead_discardreason_enum", "discardReasonOther" text, "notes" text, "contactedAt" TIMESTAMP, "assignedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "branch_id" uuid, "assigned_to_id" uuid, "converted_alumn_id" uuid, CONSTRAINT "PK_ca96c1888f7dcfccab72b72fffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "FK_1b385d8d7bf0236430c875efd16" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "FK_b14725c258cf60d5649084d6c94" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lead" ADD CONSTRAINT "FK_0ad0ffe5a0556fb11a3037e4a6e" FOREIGN KEY ("converted_alumn_id") REFERENCES "alumn"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "FK_0ad0ffe5a0556fb11a3037e4a6e"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "FK_b14725c258cf60d5649084d6c94"`);
        await queryRunner.query(`ALTER TABLE "lead" DROP CONSTRAINT "FK_1b385d8d7bf0236430c875efd16"`);
        await queryRunner.query(`DROP TABLE "lead"`);
        await queryRunner.query(`DROP TYPE "public"."lead_discardreason_enum"`);
        await queryRunner.query(`DROP TYPE "public"."lead_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."lead_categorycourse_enum"`);
        await queryRunner.query(`DROP TYPE "public"."lead_source_enum"`);
    }

}
