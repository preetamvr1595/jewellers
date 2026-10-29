const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({storage})
const { upload: uploadCtrl } = require('../controllers/uploadController')
const auth = require('../middleware/auth')

router.post('/', auth, upload.array('images'), uploadCtrl)

module.exports = router
