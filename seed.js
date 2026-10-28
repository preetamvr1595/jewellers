const storage = require('./server/scripts/storage');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, 'assets', 'images');
const files = fs.readdirSync(imageDir).filter(f => f.endsWith('.jpeg') || f.endsWith('.png'));

const products = files.map((file, i) => ({
  name: `Exquisite Item ${i + 1}`,
  price: Math.floor(Math.random() * 50000) + 10000,
  description: "A beautiful handcrafted piece from Aura Jewellers Bengaluru. BIS Hallmarked for purity and quality.",
  images: [`assets/images/${file}`],
  hallmark: "HUID",
  purity: "22k (91.6%)",
  weight: `${(Math.random() * 20 + 5).toFixed(2)}g`,
  category: i % 2 === 0 ? "necklaces" : "bangles",
  tag: i % 3 === 0 ? "bridal" : ""
}));

// Clear existing and seed
const db = { products, collections: [] };
fs.writeFileSync(path.join(__dirname, 'server', 'data.json'), JSON.stringify(db, null, 2));

console.log(`Seeded ${products.length} products to data.json`);
