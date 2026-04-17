import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { pool, q } from './db.js'

dotenv.config()

const app = express()
const PORT = Number(process.env.API_PORT || 3000)

app.use(cors())
app.use(express.json())

app.get('/ping', (_req, res) => {
  res.json({ fecha: new Date().toISOString() })
})

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, service: 'api', database: 'up' })
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

app.get(['/products', '/api/products'], async (_req, res) => {
  try {
    const rows = await q('SELECT * FROM products ORDER BY product_id', [])
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID invalido' })
    }

    const rows = await q('SELECT * FROM products WHERE product_id = $1', [id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    return res.json(rows[0])
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`API activa en http://localhost:${PORT}`)
})
