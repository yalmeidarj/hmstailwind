CREATE TABLE IF NOT EXISTS "House" (
	"id" serial PRIMARY KEY NOT NULL,
	"streetNumber" text NOT NULL,
	"lastName" text,
	"name" text,
	"notes" text,
	"phoneOrEmail" text,
	"type" text,
	"streetId" integer NOT NULL,
	"locationId" integer NOT NULL,
	"lastUpdated" timestamp(3) DEFAULT now() NOT NULL,
	"lastUpdatedBy" text,
	"statusAttempt" text,
	"consent" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Location" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"neighborhood" text DEFAULT 'to be verified' NOT NULL,
	"priorityStatus" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"checksum" varchar(64) NOT NULL,
	"finished_at" timestamp with time zone,
	"migration_name" varchar(255) NOT NULL,
	"logs" text,
	"rolled_back_at" timestamp with time zone,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_steps_count" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ShiftLogger" (
	"ShiftLoggerId" serial PRIMARY KEY NOT NULL,
	"workerId" integer NOT NULL,
	"locationId" integer NOT NULL,
	"startingDate" timestamp(3) DEFAULT now() NOT NULL,
	"finishedDate" timestamp(3) DEFAULT now(),
	"updatedHouses" integer,
	"updatedHousesFinal" integer,
	"pace" integer,
	"paceFinal" integer,
	"userProviderUserId" varchar(255),
	"isActive" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Street" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"locationId" integer NOT NULL,
	"lastVisited" timestamp(3) DEFAULT now(),
	"lastVisitedby" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Worker" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"userName" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"providerUserId" varchar(255),
	"role" varchar(15)
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "Worker_providerUserId_key" ON "Worker" ("providerUserId");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "House" ADD CONSTRAINT "House_streetId_Street_id_fk" FOREIGN KEY ("streetId") REFERENCES "Street"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "House" ADD CONSTRAINT "House_locationId_Location_id_fk" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ShiftLogger" ADD CONSTRAINT "ShiftLogger_workerId_Worker_id_fk" FOREIGN KEY ("workerId") REFERENCES "Worker"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ShiftLogger" ADD CONSTRAINT "ShiftLogger_locationId_Location_id_fk" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Street" ADD CONSTRAINT "Street_locationId_Location_id_fk" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
