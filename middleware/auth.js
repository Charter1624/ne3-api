// ── Middleware de autenticación por API key ─────────────────
// Requiere header: x-api-key: <clave>
// La clave real se guarda en process.env.API_KEY (nunca en el código)

module.exports = function auth(req, res, next) {
  const apiKey = req.headers['x-api-key']

  // Si no hay API_KEY configurada en el server, rechazamos todo
  if (!process.env.API_KEY) {
    return res.status(500).json({ ok: false, error: 'API_KEY no configurada en el servidor' })
  }

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ ok: false, error: 'No autorizado' })
  }

  next()
}
