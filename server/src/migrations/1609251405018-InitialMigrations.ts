import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigrations1609251405018 implements MigrationInterface {
    name = 'InitialMigrations1609251405018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "user_role_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "password" character varying NOT NULL, "organization" character varying, "role" "user_role_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "project_role_role_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "project_role" ("id" SERIAL NOT NULL, "role" "project_role_role_enum" NOT NULL, "projectId" integer, "userId" integer, CONSTRAINT "PK_5974798305ac81d4a7d23ab1c6a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "desc" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "issue_severity_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TYPE "issue_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`CREATE TABLE "issue" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "desc" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "severity" "issue_severity_enum" NOT NULL, "status" "issue_status_enum" NOT NULL, "projectId" integer, "createdById" integer, CONSTRAINT "PK_f80e086c249b9f3f3ff2fd321b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "project_role" ADD CONSTRAINT "FK_e3ce53609728362ae1205f060a7" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_role" ADD CONSTRAINT "FK_f3f948a17bf526f64b0518672f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue" ADD CONSTRAINT "FK_be30b91466b730c5e25f1181f79" FOREIGN KEY ("projectId") REFERENCES "project"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "issue" ADD CONSTRAINT "FK_10b17b49d1ee77e7184216001e0" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "issue" DROP CONSTRAINT "FK_10b17b49d1ee77e7184216001e0"`);
        await queryRunner.query(`ALTER TABLE "issue" DROP CONSTRAINT "FK_be30b91466b730c5e25f1181f79"`);
        await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "FK_f3f948a17bf526f64b0518672f9"`);
        await queryRunner.query(`ALTER TABLE "project_role" DROP CONSTRAINT "FK_e3ce53609728362ae1205f060a7"`);
        await queryRunner.query(`DROP TABLE "issue"`);
        await queryRunner.query(`DROP TYPE "issue_status_enum"`);
        await queryRunner.query(`DROP TYPE "issue_severity_enum"`);
        await queryRunner.query(`DROP TABLE "project"`);
        await queryRunner.query(`DROP TABLE "project_role"`);
        await queryRunner.query(`DROP TYPE "project_role_role_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "user_role_enum"`);
    }

}
