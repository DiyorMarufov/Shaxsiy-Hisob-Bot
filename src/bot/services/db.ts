import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";
import { DB_URL } from "../config";

dotenv.config();

export const pool = new Pool({
  connectionString: DB_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
