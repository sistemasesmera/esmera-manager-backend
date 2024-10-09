import { MigrationInterface, QueryRunner } from 'typeorm';

export class StartApp1728294899788 implements MigrationInterface {
  name = 'StartApp1728294899788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."alumn_documenttype_enum" AS ENUM('DNI', 'NIE', 'PASAPORTE')`,
    );
    await queryRunner.query(
      `CREATE TABLE "alumn" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "phone" character varying NOT NULL, "email" character varying NOT NULL, "birthDate" date NOT NULL, "documentType" "public"."alumn_documenttype_enum" NOT NULL, "documentNumber" character varying NOT NULL, "address" character varying NOT NULL, "postalCode" character varying NOT NULL, "population" character varying NOT NULL, "province" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fe4d493ee27efd37fb851f69a32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "course" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "price" character varying(20) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bf95180dd756fd204fb01ce4916" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contract_guarantordocumenttype_enum" AS ENUM('DNI', 'NIE', 'PASAPORTE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."contract_missingdocumentation_enum" AS ENUM('NINGUNO', 'FOTOGRAFIAS', 'DOCUMENTO')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contract" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "coursePrice" character varying NOT NULL, "name" character varying NOT NULL, "hasGuarantor" boolean NOT NULL DEFAULT false, "guarantorFirstName" character varying, "guarantorLastName" character varying, "guarantorPhone" character varying, "guarantorBirthDate" date, "guarantorEmail" character varying, "guarantorDocumentType" "public"."contract_guarantordocumenttype_enum", "guarantorDocumentNumber" character varying, "guarantorAddress" character varying, "guarantorPostalCode" character varying, "guarantorPopulation" character varying, "guarantorProvince" character varying, "paymentAgreement" text NOT NULL, "observations" text, "contractDate" date NOT NULL, "presentationDate" date NOT NULL, "courseStartDate" date NOT NULL, "courseEndDate" date NOT NULL, "classSchedule" text NOT NULL, "missingDocumentation" "public"."contract_missingdocumentation_enum" NOT NULL DEFAULT 'NINGUNO', "uniformSize" text NOT NULL, "latestStudies" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid NOT NULL, "alumnId" uuid NOT NULL, "courseId" uuid NOT NULL, CONSTRAINT "PK_17c3a89f58a2997276084e706e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('COMMERCIAL', 'COMMERCIAL_PLUS', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'COMMERCIAL', "active" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_a837a077c734b8f4106c6923685" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_6ee1843f768ecdc2b3343cd07b3" FOREIGN KEY ("alumnId") REFERENCES "alumn"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_a855603213a619ad611538fe54f" FOREIGN KEY ("courseId") REFERENCES "course"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "FK_a855603213a619ad611538fe54f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "FK_6ee1843f768ecdc2b3343cd07b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "FK_a837a077c734b8f4106c6923685"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    await queryRunner.query(`DROP TABLE "contract"`);
    await queryRunner.query(
      `DROP TYPE "public"."contract_missingdocumentation_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."contract_guarantordocumenttype_enum"`,
    );
    await queryRunner.query(`DROP TABLE "course"`);
    await queryRunner.query(`DROP TABLE "alumn"`);
    await queryRunner.query(`DROP TYPE "public"."alumn_documenttype_enum"`);
  }
}
