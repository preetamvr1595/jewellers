const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  name: {type:String, required:true},
  price: {type:Number, required:true},
  description: String,
  category: String, // bridal, bangles, etc.
  tag: String, // trending, new, etc.
  hallmark: { type: String, default: 'HUID' },
  purity: { type: String, default: '22k' },
  weight: String,
  images: [String],
  collection: { type: mongoose.Schema.Types.ObjectId, ref: 'Collection' },
  createdAt: {type:Date, default: Date.now}
})

module.exports = mongoose.model('Product', productSchema)
