import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddJoinColumnInContractEntity1754130346386
  implements MigrationInterface
{
  name = 'AddJoinColumnInContractEntity1754130346386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "FK_7e0acd2febb431736422963c5eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" RENAME COLUMN "branchId" TO "branch_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_fb10fb825ebf6e21f567de1b0c2" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "contract" DROP CONSTRAINT "FK_fb10fb825ebf6e21f567de1b0c2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" RENAME COLUMN "branch_id" TO "branchId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contract" ADD CONSTRAINT "FK_7e0acd2febb431736422963c5eb" FOREIGN KEY ("branchId") REFERENCES "branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
