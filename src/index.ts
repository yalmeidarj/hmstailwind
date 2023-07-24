import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// for migrations
const sql = postgres(
  "postgresql://postgres:2HTC7yaFZDe20nvYv4kW@containers-us-west-106.railway.app:6925/railway",
  { max: 1 }
);
const db = drizzle(sql);

await migrate(db, { migrationsFolder: "drizzle" });
