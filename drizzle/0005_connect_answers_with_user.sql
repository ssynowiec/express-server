ALTER TABLE "user" ADD COLUMN "answers_id" uuid NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_answers_id_answers_id_fk" FOREIGN KEY ("answers_id") REFERENCES "public"."answers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
