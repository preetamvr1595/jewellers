const storage = require('../storage')

exports.getSettings = (req, res) => {
  const settings = storage.getSetting('collections') || []
  res.json(settings)
}

exports.updateSetting = (req, res) => {
  const { key, value } = req.body

  if (key === 'collections') {
    storage.setSetting('collections', value)
    return res.json({ ok: true })
  }

  res.json({ ok: true })
}