import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  strict: false,
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["spotify-groups_*"],
} satisfies Config;
