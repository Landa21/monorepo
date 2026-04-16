import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),

  migrations: {
    path: path.join("prisma", "migrations"),
  },

  datasource: {
    // DIRECT_URL bypasses pgBouncer — required for migrations
    // Runtime queries use DATABASE_URL via the pg adapter in index.ts
    url: env("DIRECT_URL"),
  },
});