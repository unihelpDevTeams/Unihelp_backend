import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const initializeDatabase = async () => {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await query(sql);
};
