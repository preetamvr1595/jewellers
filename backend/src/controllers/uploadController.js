const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const fs = require('fs')
const path = require('path')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.upload = (req,res)=>{
  if(!req.files || !req.files.length) return res.status(400).json({message:'No files'})
  
  // Use Cloudinary if configured
  if (process.env.CLOUDINARY_API_KEY) {
    const uploads = []
    let completed = 0
    req.files.forEach(file => {
      const upload_stream = cloudinary.uploader.upload_stream({folder:'mgs_admin'}, (error, result) => {
        completed++
        if(error) uploads.push({error})
        else uploads.push(result.secure_url)
        if(completed === req.files.length) res.json({urls:uploads, url: uploads[0]})
      })
      streamifier.createReadStream(file.buffer).pipe(upload_stream)
    })
  } else {
    // Local storage fallback
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads')
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir)
    
    const urls = req.files.map(file => {
      const fileName = Date.now() + '-' + file.originalname
      fs.writeFileSync(path.join(uploadsDir, fileName), file.buffer)
      return `/uploads/${fileName}`
    })
    res.json({ urls, url: urls[0] })
  }
}
