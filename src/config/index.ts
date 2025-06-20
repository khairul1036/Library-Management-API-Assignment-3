import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
};
