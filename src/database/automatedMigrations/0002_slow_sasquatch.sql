ALTER TABLE "org_to_org_conversations" ADD COLUMN "subject" text;--> statement-breakpoint
ALTER TABLE "org_to_user_conversations" ADD COLUMN "subject" text;--> statement-breakpoint
ALTER TABLE "user_to_org_conversations" ADD COLUMN "subject" text;--> statement-breakpoint
ALTER TABLE "user_to_user_conversations" ADD COLUMN "subject" text;