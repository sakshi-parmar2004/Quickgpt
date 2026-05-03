import { Client } from "pg";

export const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "quickgpt",
  password: "postgre123",
  port: 5432,
});

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");

    // simple test query
    const res = await client.query("SELECT NOW()");
    // console.log(res);
    // console.log("Server time:", res.rows[0]);

  } catch (err) {
    console.error(" Connection error:", err);
  }
}

export default connectDB;