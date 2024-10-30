import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCourseDates1730200833546 implements MigrationInterface {
    name = 'UpdateCourseDates1730200833546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "presentationDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "courseStartDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "courseEndDate" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "courseEndDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "courseStartDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contract" ALTER COLUMN "presentationDate" SET NOT NULL`);
    }

}
