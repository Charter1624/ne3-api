const express = require('express')
const router  = express.Router()
const Linea   = require('../models/Linea')

// ─────────────────────────────────────────
// GET /lineas
// Devuelve todas las líneas, con filtros opcionales
// Ejemplo: GET /lineas?estado=libre
// ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const filtro = {}

    // Si mandan ?estado=libre, filtramos por eso
    if (req.query.estado) {
      filtro.estado = req.query.estado
    }

    const lineas = await Linea.find(filtro).sort({ numero: 1 })

    res.json({
      ok: true,
      total: lineas.length,
      lineas
    })

  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})


// ─────────────────────────────────────────
// GET /lineas/:numero
// Devuelve una línea específica
// Ejemplo: GET /lineas/29
// ─────────────────────────────────────────
router.get('/:numero', async (req, res) => {
  try {
    const linea = await Linea.findOne({ numero: req.params.numero })

    if (!linea) {
      return res.status(404).json({ ok: false, error: 'Línea no encontrada' })
    }

    res.json({ ok: true, linea })

  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})


// ─────────────────────────────────────────
// POST /lineas
// Crea una nueva línea
// Body: { numero, empresa, zona }
// ─────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const { numero, empresa, zona } = req.body

    const linea = new Linea({ numero, empresa, zona })
    await linea.save()

    res.status(201).json({ ok: true, linea })

  } catch (error) {
    // Si el número ya existe, Mongoose tira error de duplicado
    if (error.code === 11000) {
      return res.status(400).json({ ok: false, error: `La línea ${req.body.numero} ya existe` })
    }
    res.status(500).json({ ok: false, error: error.message })
  }
})


// ─────────────────────────────────────────
// PATCH /lineas/:numero/estado
// Cambia el estado de una línea (pegar / despegar)
// Body: { estado, cliente }
//
// Esto es lo más importante del sistema:
// cuando se pega una luneta, registramos quién la tiene y hasta cuándo
// ─────────────────────────────────────────
router.patch('/:numero/estado', async (req, res) => {
  try {
    const { estado, cliente } = req.body
    const linea = await Linea.findOne({ numero: req.params.numero })

    if (!linea) {
      return res.status(404).json({ ok: false, error: 'Línea no encontrada' })
    }

    // Guardamos el estado anterior
    const estadoAnterior = linea.estado
    linea.estado = estado

    // Si se está PEGANDO: registramos el cliente activo
    if (estado === 'pegada' && cliente) {
      linea.cliente_activo = {
        nombre:       cliente.nombre,
        mail:         cliente.mail,
        fecha_inicio: cliente.fecha_inicio || new Date(),
        fecha_fin:    cliente.fecha_fin
      }
    }

    // Si se está DESPEGANDO: movemos al historial y limpiamos cliente activo
    if (estado === 'despegada' || estado === 'libre') {
      if (linea.cliente_activo?.nombre) {
        linea.historial.push({
          cliente:      linea.cliente_activo.nombre,
          fecha_inicio: linea.cliente_activo.fecha_inicio,
          fecha_fin:    new Date(),
          producto:     cliente?.producto || 'luneta',
          precio:       cliente?.precio   || 0
        })
      }
      linea.cliente_activo = {}
    }

    await linea.save()

    res.json({
      ok: true,
      mensaje: `Línea ${linea.numero}: ${estadoAnterior} → ${estado}`,
      linea
    })

  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})


// ─────────────────────────────────────────
// GET /lineas/:numero/historial
// Ver el historial completo de una línea
// ─────────────────────────────────────────
router.get('/:numero/historial', async (req, res) => {
  try {
    const linea = await Linea.findOne({ numero: req.params.numero })

    if (!linea) {
      return res.status(404).json({ ok: false, error: 'Línea no encontrada' })
    }

    res.json({
      ok: true,
      linea: linea.numero,
      historial: linea.historial
    })

  } catch (error) {
    res.status(500).json({ ok: false, error: error.message })
  }
})

module.exports = router
