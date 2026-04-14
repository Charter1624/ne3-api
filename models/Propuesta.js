const mongoose = require('mongoose')

const PropuestaSchema = new mongoose.Schema({
  cliente:       { type: String, required: true },
  mail:          { type: String },
  fecha_validez: { type: String },
  productos:     [{ type: String }],   // ['fullglass', 'lunetas', 'lunetas_led']
  total:         { type: Number },
  detalle:       { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true })

module.exports = mongoose.model('Propuesta', PropuestaSchema)
