import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../../drizzle/schema";

const DATABASE_URL =
  "postgresql://postgres:2HTC7yaFZDe20nvYv4kW@containers-us-west-106.railway.app:6925/railway";
const queryClient = postgres(DATABASE_URL, { max: 1 });
const db = drizzle(queryClient, { schema });

export default db;
