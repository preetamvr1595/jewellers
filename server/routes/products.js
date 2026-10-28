const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const validateProduct = require('../middleware/validateProduct')
const ctrl = require('../controllers/productController')

// Public read endpoints (main site should be able to fetch listings without auth)
router.get('/', ctrl.list)
router.get('/:id', ctrl.get)

// Protected write endpoints for admin only
router.post('/', auth, validateProduct, ctrl.create)
router.put('/:id', auth, validateProduct, ctrl.update)
router.delete('/:id', auth, ctrl.remove)

module.exports = router
