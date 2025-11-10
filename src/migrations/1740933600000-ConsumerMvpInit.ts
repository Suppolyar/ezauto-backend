import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConsumerMvpInit1740933600000 implements MigrationInterface {
  name = 'ConsumerMvpInit1740933600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."user_role_enum" AS ENUM('consumer','workshop_admin','towing_driver','admin')`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'consumer'`,
    );

    await queryRunner.query(
      `ALTER TABLE "car" ALTER COLUMN "year" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD "vinDecodedData" jsonb`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD "lastMileageUpdate" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD "nextMaintenanceMileage" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" ADD "nextMaintenanceDate" TIMESTAMP WITH TIME ZONE`,
    );

    await queryRunner.query(
      `CREATE TYPE "public"."maintenance_tasks_status_enum" AS ENUM('pending','completed')`,
    );
    await queryRunner.query(`
      CREATE TABLE "maintenance_tasks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "status" "public"."maintenance_tasks_status_enum" NOT NULL DEFAULT 'pending',
        "dueDate" TIMESTAMP WITH TIME ZONE,
        "dueMileage" integer,
        "completedAt" TIMESTAMP WITH TIME ZONE,
        "completedMileage" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "car_id" uuid NOT NULL,
        "regulation_id" integer NOT NULL,
        CONSTRAINT "PK_6888c51147c437459376d21a8a8" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_type_enum" AS ENUM('maintenance_due')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."notifications_status_enum" AS ENUM('pending','sent','failed')`,
    );
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" "public"."notifications_type_enum" NOT NULL,
        "payload" jsonb NOT NULL,
        "sourceId" character varying,
        "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'pending',
        "scheduledAt" TIMESTAMP WITH TIME ZONE,
        "sentAt" TIMESTAMP WITH TIME ZONE,
        "error" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" integer NOT NULL,
        CONSTRAINT "PK_f7d4681c2aaddd5b861c3c452d2" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "maintenance_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "description" character varying,
        "mileage" integer NOT NULL,
        "performedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "metadata" jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "car_id" uuid NOT NULL,
        "task_id" uuid,
        CONSTRAINT "PK_41dcffbda0e4156f48763ae6b1f" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "push_tokens" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "token" character varying NOT NULL,
        "platform" character varying,
        "lastActiveAt" TIMESTAMP WITH TIME ZONE,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "user_id" integer NOT NULL,
        CONSTRAINT "UQ_5fa0f8852873f68006b4d9a0726" UNIQUE ("token"),
        CONSTRAINT "PK_5f77bbaa2d7517ba80b85d3e4d7" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "maintenance_tasks"
      ADD CONSTRAINT "FK_4d1f0c5a55a90223995df833295" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "maintenance_tasks"
      ADD CONSTRAINT "FK_1f0d612fdf74a2e3f8b80b9d32a" FOREIGN KEY ("regulation_id") REFERENCES "maintenance_regulations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "maintenance_logs"
      ADD CONSTRAINT "FK_31d9de8bd097c1a3ad808513946" FOREIGN KEY ("car_id") REFERENCES "car"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "maintenance_logs"
      ADD CONSTRAINT "FK_0c5b4e7b9efbc40b30304a92656" FOREIGN KEY ("task_id") REFERENCES "maintenance_tasks"("id") ON DELETE SET NULL ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "notifications"
      ADD CONSTRAINT "FK_a1de42cb6f5ad6bbfacb77a9de0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
    await queryRunner.query(`
      ALTER TABLE "push_tokens"
      ADD CONSTRAINT "FK_0e977c9cb87c5d7be2b6ea0d080" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      INSERT INTO "maintenance_regulations" ("carType","item","intervalMiles","intervalMonths","description","severity") VALUES
      ('base','Engine Oil',5000,6,'Replace engine oil and filter','medium'),
      ('base','Brake Inspection',15000,12,'Inspect brake pads, rotors and fluid levels','medium'),
      ('base','Tire Rotation',7000,6,'Rotate tires to ensure even wear','low'),
      ('base','Spark Plugs',30000,24,'Inspect and replace spark plugs if necessary','medium'),
      ('sport','Engine Oil',3500,4,'High-performance oil change and filter replacement','high'),
      ('sport','Brake Inspection',10000,8,'Inspect pads/rotors for track-level wear','high'),
      ('sport','Transmission Service',25000,18,'Check and replace transmission fluid','high'),
      ('sport','Cooling System',20000,12,'Inspect coolant levels, hoses, and radiator','medium'),
      ('luxury','Engine Oil',4000,6,'Synthetic oil service and diagnostics','medium'),
      ('luxury','Brake Inspection',12000,10,'Inspect pads, sensors, and rotors','medium'),
      ('luxury','Cabin Air Filter',15000,12,'Replace cabin air filter for air quality','low'),
      ('luxury','Suspension Check',25000,18,'Inspect adaptive suspension components','medium')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "maintenance_regulations" AS reg
      WHERE (reg."carType", reg."item", reg."intervalMiles", reg."intervalMonths") IN (
        ('base','Engine Oil',5000,6),
        ('base','Brake Inspection',15000,12),
        ('base','Tire Rotation',7000,6),
        ('base','Spark Plugs',30000,24),
        ('sport','Engine Oil',3500,4),
        ('sport','Brake Inspection',10000,8),
        ('sport','Transmission Service',25000,18),
        ('sport','Cooling System',20000,12),
        ('luxury','Engine Oil',4000,6),
        ('luxury','Brake Inspection',12000,10),
        ('luxury','Cabin Air Filter',15000,12),
        ('luxury','Suspension Check',25000,18)
      )
    `);

    await queryRunner.query(
      `ALTER TABLE "push_tokens" DROP CONSTRAINT "FK_0e977c9cb87c5d7be2b6ea0d080"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_a1de42cb6f5ad6bbfacb77a9de0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance_logs" DROP CONSTRAINT "FK_0c5b4e7b9efbc40b30304a92656"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance_logs" DROP CONSTRAINT "FK_31d9de8bd097c1a3ad808513946"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance_tasks" DROP CONSTRAINT "FK_1f0d612fdf74a2e3f8b80b9d32a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "maintenance_tasks" DROP CONSTRAINT "FK_4d1f0c5a55a90223995df833295"`,
    );

    await queryRunner.query(`DROP TABLE "push_tokens"`);
    await queryRunner.query(`DROP TABLE "maintenance_logs"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    await queryRunner.query(`DROP TABLE "maintenance_tasks"`);
    await queryRunner.query(
      `DROP TYPE "public"."maintenance_tasks_status_enum"`,
    );

    await queryRunner.query(
      `ALTER TABLE "car" DROP COLUMN "nextMaintenanceDate"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP COLUMN "nextMaintenanceMileage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "car" DROP COLUMN "lastMileageUpdate"`,
    );
    await queryRunner.query(`ALTER TABLE "car" DROP COLUMN "vinDecodedData"`);
    await queryRunner.query(
      `ALTER TABLE "car" ALTER COLUMN "year" SET NOT NULL`,
    );

    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
  }
}
