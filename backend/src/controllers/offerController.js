const storage = require('../storage')

exports.list = (req, res) => {
  res.json(storage.find('offers'))
}

exports.create = (req, res) => {
  const item = storage.create('offers', req.body)
  res.status(201).json(item)
}

exports.update = (req, res) => {
  const item = storage.update('offers', req.params.id, req.body)
  if (!item) return res.status(404).json({ message: 'Not found' })
  res.json(item)
}

exports.remove = (req, res) => {
  const { id } = req.params;
  console.log(`[OfferController] Attempting to remove offer with ID: ${id}`);
  const removed = storage.remove('offers', id);
  if (removed) {
    console.log(`[OfferController] Successfully removed offer with ID: ${id}`);
    res.json({ ok: true });
  } else {
    console.log(`[OfferController] Offer with ID: ${id} not found or already deleted`);
    res.status(404).json({ message: 'Offer not found' });
  }
}