const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, 'server', 'data.json');

const initialData = {
  settings: [
    { _id: '1', key: 'heroTitle', value: 'Generations of Trust,\nCrafted in Gold' },
    { _id: '2', key: 'heroSubtitle', value: 'Bengaluru\'s legacy of pure craftsmanship. BIS & HUID certified. Transparent pricing, maker-direct value.' },
    { _id: '3', key: 'wastageRate', value: '7.99' },
    { _id: '4', key: 'makingChargeOff', value: '100' }
  ],
  offers: [
    {
      _id: 'o1',
      title: 'Shubh Diwali Special',
      description: 'Celebrate this Diwali with unmatched value on pure gold. For a limited period, Aura Jewellers is offering our lowest-ever making charges and maximum value on old gold exchange.',
      poster: 'assets/diwali_poster.png',
      wastage: '7.99%',
      discount: '100% OFF',
      extraValue: '₹200/g',
      endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      active: true
    }
  ]
};

try {
  const db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  db.settings = initialData.settings;
  db.offers = initialData.offers;
  fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
  console.log('Settings and Offers seeded successfully in data.json');
} catch (e) {
  console.error('Seeding failed', e);
}
