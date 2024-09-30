CREATE TABLE IF NOT EXISTS "listing_volunteers" (
	"listing_id" text NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "listing_volunteers_userId_listing_id_pk" PRIMARY KEY("userId","listing_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listing_volunteers" ADD CONSTRAINT "listing_volunteers_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listing_volunteers" ADD CONSTRAINT "listing_volunteers_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
