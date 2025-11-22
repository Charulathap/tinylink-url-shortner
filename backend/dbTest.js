import pool from "./db.js";

async function testDB() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("DB Connected:", result.rows);
  } catch (err) {
    console.error("DB Connection Error:", err);
  }
}
testDB();
