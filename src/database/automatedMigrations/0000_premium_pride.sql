DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('email', 'google', 'github');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "listings" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"thumbnail" text,
	"organization" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"content" json,
	"messageType" integer NOT NULL,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"user_to_user_id" text,
	"user_to_org_id" text,
	"org_to_user_id" text,
	"org_to_org_id" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "org_to_org_conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"senderId" text NOT NULL,
	"recipientId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "org_to_user_conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"senderId" text NOT NULL,
	"recipientId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizations" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"thumbnail" json,
	"createdOn" timestamp DEFAULT NOW() NOT NULL,
	"creatorId" text NOT NULL,
	"images" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
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
CREATE TABLE IF NOT EXISTS "user_to_org_conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"senderId" text NOT NULL,
	"recipientId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_to_user_conversations" (
	"id" text PRIMARY KEY NOT NULL,
	"senderId" text NOT NULL,
	"recipientId" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"bio" text DEFAULT '' NOT NULL,
	"createdAt" timestamp DEFAULT NOW() NOT NULL,
	"customImage" boolean DEFAULT false,
	"customUserImage" json
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "listings" ADD CONSTRAINT "listings_organization_organizations_id_fk" FOREIGN KEY ("organization") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_user_to_user_id_user_to_user_conversations_id_fk" FOREIGN KEY ("user_to_user_id") REFERENCES "public"."user_to_user_conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_user_to_org_id_user_to_org_conversations_id_fk" FOREIGN KEY ("user_to_org_id") REFERENCES "public"."user_to_org_conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_org_to_user_id_org_to_org_conversations_id_fk" FOREIGN KEY ("org_to_user_id") REFERENCES "public"."org_to_org_conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_org_to_org_id_org_to_org_conversations_id_fk" FOREIGN KEY ("org_to_org_id") REFERENCES "public"."org_to_org_conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_to_org_conversations" ADD CONSTRAINT "org_to_org_conversations_senderId_organizations_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_to_org_conversations" ADD CONSTRAINT "org_to_org_conversations_recipientId_organizations_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_to_user_conversations" ADD CONSTRAINT "org_to_user_conversations_senderId_organizations_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "org_to_user_conversations" ADD CONSTRAINT "org_to_user_conversations_recipientId_user_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizations" ADD CONSTRAINT "organizations_creatorId_user_id_fk" FOREIGN KEY ("creatorId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_org_conversations" ADD CONSTRAINT "user_to_org_conversations_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_org_conversations" ADD CONSTRAINT "user_to_org_conversations_recipientId_organizations_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_user_conversations" ADD CONSTRAINT "user_to_user_conversations_senderId_user_id_fk" FOREIGN KEY ("senderId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_to_user_conversations" ADD CONSTRAINT "user_to_user_conversations_recipientId_user_id_fk" FOREIGN KEY ("recipientId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
