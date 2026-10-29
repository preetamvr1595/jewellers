const fs = require('fs');
const path = require('path');

// Shuffle function for randomization
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Available jpeg images from assets/images/
const jpegImages = [
  'assets/images/1.jpeg', 'assets/images/2.jpeg', 'assets/images/3.jpeg',
  'assets/images/4.jpeg', 'assets/images/5.jpeg', 'assets/images/6.jpeg',
  'assets/images/7.jpeg', 'assets/images/8.jpeg', 'assets/images/9.jpeg',
  'assets/images/10.jpeg', 'assets/images/11.jpeg', 'assets/images/12.jpeg',
  'assets/images/13.jpeg', 'assets/images/14.jpeg', 'assets/images/15.jpeg',
  'assets/images/16.jpeg', 'assets/images/17.jpeg', 'assets/images/18.jpeg',
  'assets/images/19.jpeg', 'assets/images/20.jpeg', 'assets/images/21.jpeg',
  'assets/images/22.jpeg', 'assets/images/23.jpeg', 'assets/images/24.jpeg',
  'assets/images/25.jpeg'
];

// Category-specific asset images (more distinctive per category)
const categoryAssets = {
  bridal: ['assets/kasumalai.png', 'assets/hero_necklace.png'],
  necklaces: ['assets/kasumalai.png', 'assets/mangalsutra.png', 'assets/hero_necklace.png'],
  bangles: ['assets/temple_bangles.png', 'assets/antique_bangles.png'],
  earrings: ['assets/diamond_earrings.png', 'assets/studs.png'],
  rings: ['assets/ring.png', 'assets/diamond_earrings.png'],
  chains: ['assets/gold_chain.png', 'assets/hero_necklace.png'],
  mangalsutra: ['assets/mangalsutra.png', 'assets/kasumalai.png'],
  anklets: ['assets/antique_bangles.png', 'assets/temple_bangles.png'],
  pendants: ['assets/kasumalai.png', 'assets/ring.png', 'assets/diamond_earrings.png']
};

// Combine jpeg pool with category-specific assets
function getImagesForCategory(catKey) {
  const assets = categoryAssets[catKey] || [];
  return [...assets, ...jpegImages];
}

// Product name generators by category
const bridalNames = [
  'Royal Bridal Necklace Set', 'Temple Kasumalai', 'Antique Bridal Choker',
  'Gold Temple Necklace', 'Bridal Haar', 'South Indian Bridal Set',
  'Magnificent Bridal Set', 'Traditional Bridal Haar', 'Wedding Gold Set',
  'Antique Nakshi Set', 'Bridal Jwell', 'Classic Bridal Collection',
  'Ornate Bridal Set', 'Royal Bridal Jhumka Set', 'Maharani Bridal Set'
];

const necklaceNames = [
  'Lakshmi Pendant Necklace', 'Gold Chain with Pendant', 'Antique Ruby Necklace',
  'Modern Leaf Gold Necklace', 'Filigree Gold Necklace', 'Gold Rani Haar',
  'Pearl & Gold Necklace', 'Gemstone Pendant Set', 'Gold Mangalsutra',
  'Traditional Long Necklace', 'Kundan Necklace', 'Gold Choker',
  'Bejeweled Necklace', 'Designer Gold Necklace', 'Elegant Gold Set'
];

const bangleNames = [
  'Heritage Antique Bangles', 'Temple Design Bangles', 'Plain Kadas',
  'Peacock Enamel Bangles', 'Twisted Rope Bangle', 'Wedding Chooda',
  'Antique Temple Bangle', 'Gold Kada Set', 'Filigree Bangles',
  'Kundan Bangle Set', 'Royal Bangle Pair', 'Traditional Bangle Set',
  'Bracelet Gold Set', 'Antique Nagali', 'Designer Gold Bangles'
];

const earringNames = [
  'Diamond Drop Earrings', 'Gold Stud Earrings', 'Antique Jhumka Earrings',
  'Temple Chandbali', 'Pearl Drop Earrings', 'Gold Hoop Earrings',
  'Kundan Earrings', 'Ruby Jhumkas', 'Gold Dangle Earrings',
  'Traditional Jhumka Set', 'Antique Filigree Earrings', 'Bridal Ear Cuffs',
  'Gold Statement Earrings', 'Pearl Jhumka Set', 'Designer Gold Earrings'
];

const ringNames = [
  'Floral Emerald Ring', 'Diamond Solitaire Ring', 'Temple Toe Rings',
  'Ruby Cocktail Ring', 'Gold Band Ring', 'Kundan Ring',
  'Antique Signet Ring', 'Gemstone Gold Ring', 'Bridal Ring Set',
  'Wedding Gold Ring', 'Designer Finger Ring', 'Traditional Gold Ring',
  'Paisley Pattern Ring', 'Filigree Gold Ring', 'Statement Gold Ring'
];

const chainNames = [
  'Solid Gold Rope Chain', 'Franco Box Chain', 'Herringbone Flat Chain',
  'Singapore Twist Chain', 'Gold Curb Chain', 'Spiga Chain',
  'Rope Gold Chain', 'Miami Cuban Link', 'Gold Wheat Chain',
  'Venetian Chain', 'Singapore Chain', 'Box Chain Gold',
  'Snake Chain Gold', 'Mariner Chain', 'Figaro Chain'
];

const mangalsutraNames = [
  'Traditional Mangalsutra', 'Diamond Mangalsutra', 'Antique Gold Mangalsutra',
  'Black Bead Mangalsutra', 'Temple Pendant Mangalsutra', 'Modern Diamond Set',
  'Royal Mangalsutra', 'Bridal Mangalsutra Set', 'Antique Bead Mangalsutra',
  'Gold Temple Mangalsutra', 'Contemporary Mangalsutra', 'Traditional Bead Set',
  'Diamond Accent Mangalsutra', 'Ornate Gold Mangalsutra', 'Classic South Indian'
];

const ankletNames = [
  'Ghungroo Anklet', 'Flat Link Anklet', 'Gold Payal Set',
  'Bell Anklets', 'Traditional Payal', 'Antique Anklet',
  'Designer Gold Anklet', 'Pearl Anklet Set', 'Filigree Anklet',
  'Beaded Gold Anklet', 'Traditional Ghungroo', 'Wedding Payal',
  'Gold Paayal Set', 'Antique Paayal', 'Designer Payal'
];

const pendantNames = [
  'Ganesh Gold Pendant', 'Om Diamond Pendant', 'Lakshmi Coin Pendant',
  'Lord Murugan Pendant', 'Hanuman Pendant', 'Omkara Pendant',
  'Lakshmi Narayana Pendant', 'Trishul Pendant', 'Ganesha Gold Pendant',
  'Sacred Om Pendant', 'Temple Pendant', 'Gemstone Pendant',
  'Kundan Pendant', 'Diamond Pendant', 'Antique Coin Pendant'
];

const categories = [
  { key: 'bridal', names: bridalNames },
  { key: 'necklaces', names: necklaceNames },
  { key: 'bangles', names: bangleNames },
  { key: 'earrings', names: earringNames },
  { key: 'rings', names: ringNames },
  { key: 'chains', names: chainNames },
  { key: 'mangalsutra', names: mangalsutraNames },
  { key: 'anklets', names: ankletNames },
  { key: 'pendants', names: pendantNames }
];

const products = [];

// Generate ~15 products per category - each product gets unique image
categories.forEach((cat, catIdx) => {
  // Get images specific to this category + jpeg pool
  const catImages = getImagesForCategory(cat.key);
  // Shuffle and ensure we have enough unique images
  const shuffledImages = shuffle(catImages);

  cat.names.forEach((name, nameIdx) => {
    // Use unique image - if we run out, re-shuffle
    let img;
    if (nameIdx < shuffledImages.length) {
      img = shuffledImages[nameIdx];
    } else {
      // Re-shuffle for additional images
      const reshuffled = shuffle(catImages);
      img = reshuffled[nameIdx % reshuffled.length];
    }

    // Generate varied price based on category
    let basePrice;
    switch(cat.key) {
      case 'bridal': basePrice = 85000 + Math.random() * 120000; break;
      case 'necklaces': basePrice = 45000 + Math.random() * 85000; break;
      case 'bangles': basePrice = 25000 + Math.random() * 55000; break;
      case 'earrings': basePrice = 15000 + Math.random() * 45000; break;
      case 'rings': basePrice = 12000 + Math.random() * 38000; break;
      case 'chains': basePrice = 35000 + Math.random() * 65000; break;
      case 'mangalsutra': basePrice = 55000 + Math.random() * 95000; break;
      case 'anklets': basePrice = 8000 + Math.random() * 22000; break;
      case 'pendants': basePrice = 5000 + Math.random() * 18000; break;
      default: basePrice = 20000 + Math.random() * 40000;
    }

    const weight = (basePrice / 6842).toFixed(2); // Rough weight calculation at 22k rate

    products.push({
      name: name,
      price: Math.round(basePrice),
      description: `Exquisite 22K ${cat.key} from Aura Jewellers Bengaluru. Handcrafted with traditional craftsmanship and BIS/HUID certified for purity.`,
      images: [img],
      hallmark: 'HUID',
      purity: '22K Gold (91.6%)',
      weight: `${weight}g`,
      category: cat.key,
      tag: catIdx === 0 ? 'bridal' : (nameIdx % 4 === 0 ? 'new' : '')
    });
  });
});

console.log(`Generated ${products.length} products across ${categories.length} categories`);

// Read existing data and update products
const dataPath = path.resolve(__dirname, '..', 'data.json');
let db = { products: [], collections: [], settings: [], offers: [] };

try {
  db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
} catch(e) {
  console.log('Creating new data file');
}

db.products = products;

// Write back
fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));
console.log(`Seeded ${products.length} products to data.json`);
console.log('\nCategory breakdown:');
categories.forEach(cat => {
  console.log(`  ${cat.key}: ${cat.names.length} products`);
});