import type { Config } from "drizzle-kit";

export default {
  schema: "./schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString:
      "postgresql://postgres:2HTC7yaFZDe20nvYv4kW@containers-us-west-106.railway.app:6925/railway",
  },
} satisfies Config;
