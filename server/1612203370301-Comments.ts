import {MigrationInterface, QueryRunner} from "typeorm";

export class Comments1612203370301 implements MigrationInterface {
    name = 'Comments1612203370301'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" RENAME COLUMN "content" TO "comment"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" RENAME COLUMN "comment" TO "content"`);
    }

}
