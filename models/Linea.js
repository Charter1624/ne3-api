const mongoose = require('mongoose')

// Este es el "molde" de cada línea de colectivo
// Mongoose se encarga de validar que los datos sean correctos
const LineaSchema = new mongoose.Schema({

  numero: {
    type: Number,
    required: true,  // obligatorio
    unique: true     // no puede haber dos líneas con el mismo número
  },

  empresa: {
    type: String,
    required: true   // ej: "Pedro de Mendoza", "MONSA"
  },

  zona: {
    type: String     // ej: "Norte", "Sur", "CABA"
  },

  // Estado actual de la línea
  estado: {
    type: String,
    enum: ['libre', 'pegada', 'despegada'],  // solo estos 3 valores son válidos
    default: 'libre'
  },

  // Si tiene cliente activo, guardamos los datos acá
  cliente_activo: {
    nombre:        { type: String },
    mail:          { type: String },
    fecha_inicio:  { type: Date },
    fecha_fin:     { type: Date }
  },

  // Historial de todas las campañas que tuvo esta línea
  historial: [{
    cliente:       { type: String },
    fecha_inicio:  { type: Date },
    fecha_fin:     { type: Date },
    producto:      { type: String },  // 'luneta', 'luneta_led', 'fullglass'
    precio:        { type: Number }
  }]

}, {
  timestamps: true  // agrega createdAt y updatedAt automáticamente
})

module.exports = mongoose.model('Linea', LineaSchema)
