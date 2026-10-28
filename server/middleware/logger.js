// Request Timing & Access Logger Middleware
module.exports = (req, res, next) => {
  // Only log API requests to keep logs clean
  if (!req.originalUrl.startsWith('/api')) {
    return next()
  }

  const start = process.hrtime()

  res.on('finish', () => {
    const diff = process.hrtime(start)
    const timeMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2)
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${timeMs}ms)`)
  })

  next()
}
