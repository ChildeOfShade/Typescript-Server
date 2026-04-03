import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "src/<path_to_schema>",
  out: "src/<path_to_generated_files>",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgres://wagslane:LangleyS0ryu!@localhost:5432/chirpy?sslmode=disable",
  },
});