import { MigrationInterface, QueryRunner } from 'typeorm';

export class CarTypeRules1742160000000 implements MigrationInterface {
  name = 'CarTypeRules1742160000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "car_type_rules" (
        "id" SERIAL NOT NULL,
        "carType" character varying NOT NULL,
        "makePattern" character varying,
        "modelPattern" character varying,
        "bodyClassPattern" character varying,
        "priority" integer NOT NULL DEFAULT 100,
        CONSTRAINT "PK_car_type_rules_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      INSERT INTO "car_type_rules" ("carType","makePattern","modelPattern","bodyClassPattern","priority") VALUES
      ('sport','bmw','m3',NULL,10),
      ('sport','acura','type r',NULL,10),
      ('sport','nissan','gt-r',NULL,20),
      ('sport','toyota','supra',NULL,30),
      ('luxury','bmw',NULL,NULL,50),
      ('luxury','mercedes',NULL,NULL,60),
      ('luxury','audi',NULL,NULL,70),
      ('luxury','lexus',NULL,NULL,80)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "car_type_rules"`);
  }
}
