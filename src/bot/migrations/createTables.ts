import { query } from "../services/db";

export async function createTables() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      chat_id BIGINT PRIMARY KEY,
      username TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS expenses (
      id SERIAL PRIMARY KEY,
      chat_id BIGINT NOT NULL REFERENCES users(chat_id),
      name TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      category TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS incomes (
      id SERIAL PRIMARY KEY,
      chat_id BIGINT NOT NULL REFERENCES users(chat_id),
      source TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      chat_id BIGINT PRIMARY KEY REFERENCES users(chat_id),
      expense_limit NUMERIC DEFAULT 0,
      notify BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  console.log("Barcha jadvalar yaratildi ✅");
}
