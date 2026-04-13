// Corré este script UNA sola vez para cargar las líneas iniciales
// node db/seed.js

const mongoose = require('mongoose')
const Linea    = require('../models/Linea')
require('dotenv').config()

// Todas las líneas de NE3 que ya conocemos del PDF
const LINEAS_NE3 = [
  { numero: 1,   empresa: 'Por definir', zona: 'CABA' },
  { numero: 8,   empresa: 'Por definir', zona: 'CABA' },
  { numero: 21,  empresa: 'Por definir', zona: 'CABA-GBA' },
  { numero: 25,  empresa: 'Por definir', zona: 'CABA' },
  { numero: 26,  empresa: 'Por definir', zona: 'GBA Norte' },
  { numero: 29,  empresa: 'Por definir', zona: 'CABA-GBA Norte' },
  { numero: 33,  empresa: 'Por definir', zona: 'CABA' },
  { numero: 44,  empresa: 'Por definir', zona: 'CABA' },
  { numero: 45,  empresa: 'Por definir', zona: 'CABA' },
  { numero: 46,  empresa: 'Por definir', zona: 'CABA' },
  { numero: 60,  empresa: 'MONSA',       zona: 'CABA' },
  { numero: 70,  empresa: 'Por definir', zona: 'GBA' },
  { numero: 76,  empresa: 'Por definir', zona: 'CABA' },
  { numero: 78,  empresa: 'Por definir', zona: 'GBA' },
  { numero: 85,  empresa: 'Por definir', zona: 'GBA' },
  { numero: 87,  empresa: 'Por definir', zona: 'GBA' },
  { numero: 91,  empresa: 'Por definir', zona: 'GBA' },
  { numero: 93,  empresa: 'Por definir', zona: 'CABA' },
  { numero: 99,  empresa: 'Por definir', zona: 'CABA' },
  { numero: 100, empresa: 'Por definir', zona: 'GBA' },
  { numero: 108, empresa: 'Por definir', zona: 'CABA' },
  { numero: 115, empresa: 'Por definir', zona: 'GBA' },
  { numero: 117, empresa: 'Por definir', zona: 'CABA' },
  { numero: 118, empresa: 'Por definir', zona: 'GBA' },
  { numero: 119, empresa: 'Por definir', zona: 'GBA' },
  { numero: 130, empresa: 'Por definir', zona: 'CABA' },
  { numero: 132, empresa: 'Por definir', zona: 'CABA' },
  { numero: 135, empresa: 'Por definir', zona: 'CABA' },
  { numero: 302, empresa: 'Por definir', zona: 'GBA Sur' },
  { numero: 303, empresa: 'Por definir', zona: 'GBA Sur' },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ne3')
    console.log('✅ Conectado a MongoDB')

    // Borramos lo que había e insertamos todo de nuevo
    await Linea.deleteMany({})
    await Linea.insertMany(LINEAS_NE3)

    console.log(`✅ ${LINEAS_NE3.length} líneas cargadas correctamente`)
    process.exit(0)

  } catch (err) {
    console.error('❌ Error:', err.message)
    process.exit(1)
  }
}

seed()
