const express    = require('express')
const mongoose   = require('mongoose')
const cors       = require('cors')
require('dotenv').config()

const app = express()

// ── Middlewares ───────────────────────────
app.use(cors())           // permite llamadas desde la app mobile
app.use(express.json())   // para leer el body en JSON

// ── Rutas ─────────────────────────────────
app.use('/lineas', require('./routes/lineas'))

// Ruta de prueba - para verificar que el servidor anda
app.get('/', (req, res) => {
  res.json({
    ok: true,
    mensaje: 'NE3 API funcionando',
    version: '1.0.0',
    endpoints: [
      'GET  /lineas',
      'GET  /lineas?estado=libre',
      'GET  /lineas/:numero',
      'POST /lineas',
      'PATCH /lineas/:numero/estado',
      'GET  /lineas/:numero/historial'
    ]
  })
})

// ── Conexión a MongoDB ────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ne3'

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB')

    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
      console.log(`   Probá: http://localhost:${PORT}/lineas`)
    })
  })
  .catch(err => {
    console.error('❌ Error conectando a MongoDB:', err.message)
    console.log('   Asegurate de tener MongoDB corriendo o configurar MONGO_URI en .env')
  })
