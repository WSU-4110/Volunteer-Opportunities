import postgres from "postgres";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/database/schema.ts",
  out: "./src/database/automatedMigrations",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});