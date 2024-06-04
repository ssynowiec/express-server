DO $$ BEGIN
 CREATE TYPE "public"."eventProgress" AS ENUM('not-started', 'in-progress', 'completed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "event_code" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "progress" "eventProgress" DEFAULT 'not-started' NOT NULL;