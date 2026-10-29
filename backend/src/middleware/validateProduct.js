// Product Payload Validation Middleware
module.exports = (req, res, next) => {
  const { name, category, price } = req.body

  if (req.method === 'POST') {
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Product name is required.' })
    }
    if (price !== undefined && (isNaN(Number(price)) || Number(price) < 0)) {
      return res.status(400).json({ success: false, message: 'Product price must be a non-negative number.' })
    }
  }

  if (req.method === 'PUT') {
    if (price !== undefined && (isNaN(Number(price)) || Number(price) < 0)) {
      return res.status(400).json({ success: false, message: 'Product price must be a non-negative number.' })
    }
  }

  next()
}
