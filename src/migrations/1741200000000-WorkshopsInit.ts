import { MigrationInterface, QueryRunner } from 'typeorm';

export class WorkshopsInit1741200000000 implements MigrationInterface {
  name = 'WorkshopsInit1741200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    await queryRunner.query(
      `CREATE TYPE "public"."workshops_status_enum" AS ENUM('draft','active','suspended')`,
    );

    await queryRunner.query(`
      CREATE TABLE "workshops" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "legalName" character varying NOT NULL,
        "brandName" character varying NOT NULL,
        "description" character varying,
        "website" character varying,
        "contactEmail" character varying,
        "contactPhone" character varying,
        "status" "public"."workshops_status_enum" NOT NULL DEFAULT 'draft',
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_c6f8b65b8a4c32d66b05794b0bb" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE TYPE "public"."workshop_members_role_enum" AS ENUM('owner','manager','staff')`,
    );

    await queryRunner.query(`
      CREATE TABLE "workshop_members" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "role" "public"."workshop_members_role_enum" NOT NULL DEFAULT 'manager',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "workshop_id" uuid NOT NULL,
        "user_id" integer NOT NULL,
        CONSTRAINT "PK_2a8e2bee1c9a5ca9d9936a832c9" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_workshop_members_user" UNIQUE ("workshop_id", "user_id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "workshop_locations" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "address" character varying NOT NULL,
        "latitude" double precision NOT NULL,
        "longitude" double precision NOT NULL,
        "timezone" character varying,
        "isPrimary" boolean NOT NULL DEFAULT false,
        "qrSlug" character varying NOT NULL,
        "businessHours" jsonb,
        "servicesOffered" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "workshop_id" uuid NOT NULL,
        CONSTRAINT "PK_37ec9fD7c7daaf79cccadccd335" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_workshop_locations_qrSlug" UNIQUE ("qrSlug")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."workshop_campaigns_discount_type_enum" AS ENUM('percent','fixed')
    `);
    await queryRunner.query(`
      CREATE TYPE "public"."workshop_campaigns_status_enum" AS ENUM('draft','active','paused','ended')
    `);

    await queryRunner.query(`
      CREATE TABLE "workshop_campaigns" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" character varying,
        "discountType" "public"."workshop_campaigns_discount_type_enum" NOT NULL DEFAULT 'percent',
        "discountValue" numeric(10,2) NOT NULL,
        "terms" character varying,
        "status" "public"."workshop_campaigns_status_enum" NOT NULL DEFAULT 'draft',
        "startsAt" TIMESTAMP,
        "endsAt" TIMESTAMP,
        "targetCarType" character varying,
        "media" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "workshop_id" uuid NOT NULL,
        "target_regulation_id" integer,
        CONSTRAINT "PK_5cf85ae2f2db8ba8ddf321c43cf" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TYPE "public"."workshop_campaign_redemptions_status_enum" AS ENUM('issued','redeemed','expired')
    `);

    await queryRunner.query(`
      CREATE TABLE "workshop_campaign_redemptions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "status" "public"."workshop_campaign_redemptions_status_enum" NOT NULL DEFAULT 'issued',
        "discountValue" numeric(10,2),
        "note" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "redeemedAt" TIMESTAMP,
        "campaign_id" uuid NOT NULL,
        "location_id" uuid,
        "user_id" integer NOT NULL,
        "car_id" uuid,
        "maintenance_task_id" uuid,
        CONSTRAINT "PK_7a67d0314ef0a0d85ef183ec88c" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "workshop_members"
      ADD CONSTRAINT "FK_member_workshop" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "workshop_members"
      ADD CONSTRAINT "FK_member_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "workshop_locations"
      ADD CONSTRAINT "FK_location_workshop" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "workshop_campaigns"
      ADD CONSTRAINT "FK_campaign_workshop" FOREIGN KEY ("workshop_id") REFERENCES "workshops"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "workshop_campaigns"
      ADD CONSTRAINT "FK_campaign_regulation" FOREIGN KEY ("target_regulation_id") REFERENCES "maintenance_regulations"("id") ON DELETE SET NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "workshop_campaign_redemptions"
      ADD CONSTRAINT "FK_redemption_campaign" FOREIGN KEY ("campaign_id") REFERENCES "workshop_campaigns"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "workshop_campaign_redemptions"
      ADD CONSTRAINT "FK_redemption_location" FOREIGN KEY ("location_id") REFERENCES "workshop_locations"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "workshop_campaign_redemptions"
      ADD CONSTRAINT "FK_redemption_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "workshop_campaign_redemptions"
      ADD CONSTRAINT "FK_redemption_car" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE SET NULL
    `);
    await queryRunner.query(`
      ALTER TABLE "workshop_campaign_redemptions"
      ADD CONSTRAINT "FK_redemption_task" FOREIGN KEY ("maintenance_task_id") REFERENCES "maintenance_tasks"("id") ON DELETE SET NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "workshop_campaign_redemptions" DROP CONSTRAINT "FK_redemption_task"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workshop_campaign_redemptions" DROP CONSTRAINT "FK_redemption_car"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workshop_campaign_redemptions" DROP CONSTRAINT "FK_redemption_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workshop_campaign_redemptions" DROP CONSTRAINT "FK_redemption_location"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workshop_campaign_redemptions" DROP CONSTRAINT "FK_redemption_campaign"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workshop_campaigns" DROP CONSTRAINT "FK_campaign_regulation"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workshop_campaigns" DROP CONSTRAINT "FK_campaign_workshop"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workshop_locations" DROP CONSTRAINT "FK_location_workshop"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workshop_members" DROP CONSTRAINT "FK_member_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "workshop_members" DROP CONSTRAINT "FK_member_workshop"`,
    );

    await queryRunner.query(`DROP TABLE "workshop_campaign_redemptions"`);
    await queryRunner.query(
      `DROP TYPE "public"."workshop_campaign_redemptions_status_enum"`,
    );

    await queryRunner.query(`DROP TABLE "workshop_campaigns"`);
    await queryRunner.query(
      `DROP TYPE "public"."workshop_campaigns_status_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."workshop_campaigns_discount_type_enum"`,
    );

    await queryRunner.query(`DROP TABLE "workshop_locations"`);
    await queryRunner.query(
      `DROP TABLE "workshop_members"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."workshop_members_role_enum"`,
    );

    await queryRunner.query(`DROP TABLE "workshops"`);
    await queryRunner.query(
      `DROP TYPE "public"."workshops_status_enum"`,
    );
  }
}
