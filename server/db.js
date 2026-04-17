import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config()

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DB_CONNECTION_URL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

async function q(sql, params = []) {
  const result = await pool.query(sql, params)
  return result.rows
}

export { pool, q }
