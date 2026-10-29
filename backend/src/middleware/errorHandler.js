// Centralized Express Error Handling Middleware
module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500)
  
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err.message || err)
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    console.error(err.stack)
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  })
}
