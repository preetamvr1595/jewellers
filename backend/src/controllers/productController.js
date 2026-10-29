const storage = require('../storage')

exports.list = (req, res) => {
  const items = storage.find('products')
  res.json(items)
}

exports.get = (req, res) => {
  const p = storage.findById('products', req.params.id)
  if (!p) return res.status(404).json({ message: 'Not found' })
  res.json(p)
}

exports.create = (req, res) => {
  const p = storage.create('products', req.body)
  res.status(201).json(p)
}

exports.update = (req, res) => {
  const p = storage.update('products', req.params.id, req.body)
  if (!p) return res.status(404).json({ message: 'Not found' })
  res.json(p)
}

exports.remove = (req, res) => {
  storage.remove('products', req.params.id)
  res.json({ ok: true })
}