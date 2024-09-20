ALTER TABLE "user" ALTER COLUMN "createdAt" SET DEFAULT NOW();--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "createdAt" SET NOT NULL;