import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseSchema1739000000000 implements MigrationInterface {
  name = 'BaseSchema1739000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" SERIAL NOT NULL,
        "name" character varying,
        "email" character varying NOT NULL,
        "passwordHash" character varying NOT NULL,
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UQ_user_email'
        ) THEN
          ALTER TABLE "user"
          ADD CONSTRAINT "UQ_user_email" UNIQUE ("email");
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "car" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "vin" character varying NOT NULL,
        "type" character varying NOT NULL DEFAULT 'base',
        "brand" character varying NOT NULL,
        "model" character varying NOT NULL,
        "year" integer NOT NULL,
        "mileage" integer NOT NULL,
        "averageMileagePerYear" integer NOT NULL,
        "userId" integer NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_407091ad12434c67c763c9bcee2" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UQ_car_vin'
        ) THEN
          ALTER TABLE "car"
          ADD CONSTRAINT "UQ_car_vin" UNIQUE ("vin");
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_car_user'
        ) THEN
          ALTER TABLE "car"
          ADD CONSTRAINT "FK_car_user"
          FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "maintenance_regulations" (
        "id" SERIAL NOT NULL,
        "carType" character varying NOT NULL,
        "item" character varying NOT NULL,
        "intervalMiles" integer NOT NULL,
        "intervalMonths" integer NOT NULL,
        "description" character varying NOT NULL,
        "severity" character varying,
        CONSTRAINT "PK_964ef0a4217082bfa2cfbd3da2b" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "maintenance_regulations";`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'FK_car_user'
        ) THEN
          ALTER TABLE "car" DROP CONSTRAINT "FK_car_user";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UQ_car_vin'
        ) THEN
          ALTER TABLE "car" DROP CONSTRAINT "UQ_car_vin";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS "car";`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM pg_constraint
          WHERE conname = 'UQ_user_email'
        ) THEN
          ALTER TABLE "user" DROP CONSTRAINT "UQ_user_email";
        END IF;
      END
      $$;
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS "user";`);
  }
}
