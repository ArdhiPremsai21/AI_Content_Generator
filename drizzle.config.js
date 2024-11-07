// import { defineConfig } from "drizzle-kit";
/**@type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.tsx",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://aiContentGenerator_owner:5qQwf0OiXZcT@ep-shiny-mountain-a5almh2y.us-east-2.aws.neon.tech/AI-Content_Generator?sslmode=require",
  },

}; 