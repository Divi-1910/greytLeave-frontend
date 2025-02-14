import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false // Disable SSL locally
});

pool
  .connect()
  .then(() => {
    console.log(`Connected Successfully to PostgreSQL`);
  })
  .catch((error) => {
    console.log(`Error in Connection to the database - ${error}`);
  });

export default pool;
