ALTER TABLE "user" ALTER COLUMN "createdAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "organizations" ADD COLUMN "creatorId" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizations" ADD CONSTRAINT "organizations_creatorId_user_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
