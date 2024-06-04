DO $$ BEGIN
 CREATE TYPE "public"."eventStatus" AS ENUM('active', 'draft', 'archived');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"question" text NOT NULL,
	"answers" json[] NOT NULL,
	"status" "eventStatus" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
