const express     = require('express')
const mongoose    = require('mongoose')
const cors        = require('cors')
const helmet      = require('helmet')
const rateLimit   = require('express-rate-limit')
const auth        = require('./middleware/auth')
require('dotenv').config()

const app = express()

// ── Seguridad ──────────────────────────────
app.use(helmet())

// CORS restringido a los dominios permitidos
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim())

app.use(cors({
  origin: (origin, cb) => {
    // Permite requests sin origin (Postman, curl, server-to-server)
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin)) return cb(null, true)
    return cb(new Error('CORS: origen no permitido'))
  }
}))

// Rate limiting global — 100 requests cada 15 min por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Demasiadas solicitudes. Intenta de nuevo en unos minutos.' }
})
app.use(limiter)

app.use(express.json({ limit: '100kb' }))

// ── Ruta pública (health check) ────────────
app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'NE3 API funcionando', version: '1.1.0' })
})

// ── Rutas protegidas con API key ───────────
app.use('/lineas',     auth, require('./routes/lineas'))
app.use('/propuestas', auth, require('./routes/propuestas'))

// ── Conexión a MongoDB ────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ne3'

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB')
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message)
    console.log('   Configurá MONGO_URI en .env')
  })
