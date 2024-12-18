import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCampaignAndCouponTables1734359017893 implements MigrationInterface {
    name = 'CreateCampaignAndCouponTables1734359017893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "campaign" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "campaignCode" character varying NOT NULL, "courseName" character varying(50) NOT NULL, "discountAmount" integer NOT NULL, "totalCoupons" integer NOT NULL, "availableCoupons" integer NOT NULL, "expirationDate" TIMESTAMP NOT NULL, "status" character varying NOT NULL, CONSTRAINT "UQ_dbd54256760f1b90c2174ed303a" UNIQUE ("campaignCode"), CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "coupon" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "couponCode" character varying NOT NULL, "email" character varying NOT NULL, "name" character varying(50) NOT NULL, "phone" character varying(50) NOT NULL, "isUsed" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "campaignId" uuid, CONSTRAINT "UQ_8c53e91ce72dd424a812e771136" UNIQUE ("couponCode"), CONSTRAINT "PK_fcbe9d72b60eed35f46dc35a682" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "coupon" ADD CONSTRAINT "FK_7ac51f1d9be230eb51873e5214c" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "coupon" DROP CONSTRAINT "FK_7ac51f1d9be230eb51873e5214c"`);
        await queryRunner.query(`DROP TABLE "coupon"`);
        await queryRunner.query(`DROP TABLE "campaign"`);
    }

}
