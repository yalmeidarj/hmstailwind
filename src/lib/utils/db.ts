import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../../drizzle/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const DATABASE_URL = process.env.DATABASE_URL;
const queryClient = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(queryClient, { schema });

export default db;
