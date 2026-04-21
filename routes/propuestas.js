const express    = require('express')
const router     = express.Router()
const Propuesta  = require('../models/Propuesta')

// Guardar nueva propuesta
router.post('/', async (req, res) => {
  try {
    const { cliente, mail, productos, total } = req.body

    // Validación básica (anti-basura)
    if (!cliente || typeof cliente !== 'string' || cliente.trim().length < 2) {
      return res.status(400).json({ ok: false, error: 'Cliente inválido' })
    }
    if (cliente.length > 120) {
      return res.status(400).json({ ok: false, error: 'Cliente demasiado largo' })
    }
    if (mail && (typeof mail !== 'string' || mail.length > 120)) {
      return res.status(400).json({ ok: false, error: 'Email inválido' })
    }
    if (!Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({ ok: false, error: 'Debe incluir al menos un producto' })
    }
    if (typeof total !== 'number' || total < 0) {
      return res.status(400).json({ ok: false, error: 'Total inválido' })
    }

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
