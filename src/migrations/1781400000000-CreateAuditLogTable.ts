import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogTable1781400000000 implements MigrationInterface {
    name = 'CreateAuditLogTable1781400000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying, "userEmail" character varying, "action" character varying NOT NULL, "entityType" character varying, "entityId" character varying, "details" jsonb, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_audit_log_id" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "audit_log"`);
    }
}
