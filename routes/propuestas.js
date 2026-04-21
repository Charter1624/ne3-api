const express    = require('express')
const router     = express.Router()
const Propuesta  = require('../models/Propuesta')

// Guardar nueva propuesta
router.post('/', async (req, res) => {
  try {
    const p = new Propuesta(req.body)
    await p.save()
    res.json({ ok: true, propuesta: p })
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message })
  }
})

// Listar propuestas (las últimas 100)
router.get('/', async (req, res) => {
  try {
    const propuestas = await Propuesta.find().sort({ createdAt: -1 }).limit(100)
    res.json({ ok: true, total: propuestas.length, propuestas })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

module.exports = router
