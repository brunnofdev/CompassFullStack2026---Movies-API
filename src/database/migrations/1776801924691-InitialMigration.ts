import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1776801924691 implements MigrationInterface {
    name = 'InitialMigration1776801924691'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tb_directors" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "UQ_efa7d8d74073a6bb7fff35edc72" UNIQUE ("name"), CONSTRAINT "PK_4f1f964b2c794201e5668d084f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tb_movies" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying(255), "releaseYear" integer NOT NULL, "genre" character varying NOT NULL, "directorId" integer NOT NULL, CONSTRAINT "PK_5c8c174044c971d524bce0477ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tb_movies" ADD CONSTRAINT "FK_eb994a8b18c5b09f5b250a496be" FOREIGN KEY ("directorId") REFERENCES "tb_directors"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tb_movies" DROP CONSTRAINT "FK_eb994a8b18c5b09f5b250a496be"`);
        await queryRunner.query(`DROP TABLE "tb_movies"`);
        await queryRunner.query(`DROP TABLE "tb_directors"`);
    }

}
