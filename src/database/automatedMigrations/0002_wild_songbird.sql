CREATE TABLE IF NOT EXISTS "listings" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"thumbnail" text,
	"organization" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"senderId" text NOT NULL,
	"recipientId" text NOT NULL,
	"content" text,
	"imageUrl" text,
	"messageType" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "messages_senderId_recipientId_pk" PRIMARY KEY("senderId","recipientId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"imageUrl" text,
	"createdOn" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"iconUrl" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "listings_skills" (
	"skill_id" text NOT NULL,
	"listingId" text NOT NULL,
	CONSTRAINT "listings_skills_listingId_skill_id_pk" PRIMARY KEY("listingId","skill_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "volunteer_skills" (
	"skill_id" text NOT NULL,
	"userId" text NOT NULL,
	CONSTRAINT "volunteer_skills_userId_skill_id_pk" PRIMARY KEY("userId","skill_id")
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "createdAt" timestamp NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings" ADD CONSTRAINT "listings_organization_organizations_id_fk" FOREIGN KEY ("organization") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_recipientId_user_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings_skills" ADD CONSTRAINT "listings_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings_skills" ADD CONSTRAINT "listings_skills_listingId_listings_id_fk" FOREIGN KEY ("listingId") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "volunteer_skills" ADD CONSTRAINT "volunteer_skills_skill_id_skills_id_fk" FOREIGN KEY ("skill_id") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "volunteer_skills" ADD CONSTRAINT "volunteer_skills_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
