ALTER TABLE "events" ADD COLUMN "author_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "events" ADD CONSTRAINT "events_author_id_admin_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."admin"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
