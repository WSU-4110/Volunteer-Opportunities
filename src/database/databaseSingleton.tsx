import * as schema from "./schema";
import { PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// This is an implementation of the "index.ts" file that is used in this database folder.

// Instead of creating one connection variable that is shown in the lecture slides, I creat two connection variables which are postgresConnection and drizzleConnection.
// drizzleConnection is used for connecting with the postgres table through drizzle, and postgresConnection is used for connecting to the postgres table through pg.

class DatabaseSingleton {
  private static instance: DatabaseSingleton | null = null;
  private postgresConnection: PostgresJsDatabase<typeof schema> | null = null;
  private drizzleConnection: ReturnType<typeof postgres> | null = null;

  private constructor() {
    const pg = postgres(process.env.DATABASE_URL || "") as any;
    this.postgresConnection = pg;
    this.drizzleConnection = drizzle(pg, { schema }) as any;
  }

  static getInstance() {
    if (!DatabaseSingleton.instance) {
      DatabaseSingleton.instance = new DatabaseSingleton();
    }
    return DatabaseSingleton.instance;
  }
}

const connection = DatabaseSingleton.getInstance();
export default connection;
