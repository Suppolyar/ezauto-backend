import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1753968003438 implements MigrationInterface {
    name = 'Init1753968003438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "maintenance_regulations" ("id" SERIAL NOT NULL, "carType" character varying NOT NULL, "item" character varying NOT NULL, "intervalMiles" integer NOT NULL, "intervalMonths" integer NOT NULL, "description" character varying NOT NULL, "severity" character varying, CONSTRAINT "PK_287163ad2bdf33aa10f3e2c9106" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "car" ADD "type" character varying NOT NULL DEFAULT 'base'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TABLE "maintenance_regulations"`);
    }

}
