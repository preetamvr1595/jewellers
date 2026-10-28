require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const authRoutes = require('./routes/auth')
const productRoutes = require('./routes/products')
const uploadRoutes = require('./routes/upload')
const settingRoutes = require('./routes/settings')
const offerRoutes = require('./routes/offers')
const rateRoutes = require('./routes/rates')

const app = express()
app.disable('x-powered-by')
app.use(cors())
app.use(express.json())

// Basic HTTP security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

// Static assets for Main Site
const rootPath = path.resolve(__dirname, '..')
app.use('/assets', express.static(path.resolve(rootPath, 'assets')))

// Static assets for Admin Dashboard (Vite build folder)
const adminDist = path.resolve(rootPath, 'client', 'dist')
if (fs.existsSync(adminDist)) {
  app.use('/assets', express.static(path.resolve(adminDist, 'assets')))
  app.use('/admin', express.static(adminDist))
  app.get('/admin/*', (req, res) => {
    res.sendFile(path.resolve(adminDist, 'index.html'))
  })
}

// Explicit endpoints for SEO Sitemap and Robots.txt to avoid general HTTP fetch errors and set explicit headers
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Cache-Control', 'public, max-age=86400');
  console.log(`[SEO] sitemap.xml requested by user-agent: ${req.headers['user-agent'] || 'Unknown'}`);
  res.sendFile(path.resolve(rootPath, 'sitemap.xml'));
});

app.get('/robots.txt', (req, res) => {
  res.header('Content-Type', 'text/plain');
  res.header('Cache-Control', 'public, max-age=86400');
  console.log(`[SEO] robots.txt requested by user-agent: ${req.headers['user-agent'] || 'Unknown'}`);
  res.sendFile(path.resolve(rootPath, 'robots.txt'));
});

// Serve top-level static site with custom headers to prevent aggressive caching and force UTF-8 encoding
app.use('/', express.static(rootPath, {
  setHeaders: (res, filePath) => {
    // Force UTF-8 character encoding for HTML, JS and CSS to ensure emojis and ticks render correctly
    if (filePath.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    } else if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
  }
}))

// serve uploaded files
app.use('/uploads', express.static(path.resolve(rootPath, 'server', 'uploads')))

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/settings', settingRoutes)
app.use('/api/offers', offerRoutes)
app.use('/api/rates', rateRoutes)

const PORT = process.env.PORT || 5000

const startServer = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (mongoUri) {
    console.log('[Database] Connecting to MongoDB...');
    const mongoose = require('mongoose');
    try {
      await mongoose.connect(mongoUri);
      console.log('[Database] Connected to MongoDB.');

      // Load backup
      let DBBackup;
      try {
        DBBackup = mongoose.model('DBBackup');
      } catch (e) {
        const dbBackupSchema = new mongoose.Schema({
          key: { type: String, default: 'mgs_db_backup', unique: true },
          data: mongoose.Schema.Types.Mixed,
          updatedAt: { type: Date, default: Date.now }
        });
        DBBackup = mongoose.model('DBBackup', dbBackupSchema);
      }

      const backup = await DBBackup.findOne({ key: 'mgs_db_backup' });
      const dataPath = path.resolve(__dirname, 'data.json');
      let localData = null;
      if (fs.existsSync(dataPath)) {
        try {
          localData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        } catch (e) {
          console.error('[Database] Failed to parse local data.json:', e);
        }
      }

      if (backup && backup.data) {
        // Perform a Smart Merge to prevent overwriting live admin changes
        const mergedData = { ...backup.data };
        
        // Extract products
        const backupProducts = backup.data.products || [];
        const localProducts = (localData && localData.products) ? localData.products : [];

        // Check for new products in localData that do not exist in backup by _id
        const backupProductIds = new Set(backupProducts.map(p => p._id));
        const newProductsToAdd = localProducts.filter(p => !backupProductIds.has(p._id));

        console.log(`[Database] Products - Local: ${localProducts.length}, MongoDB Atlas: ${backupProducts.length}.`);

        if (newProductsToAdd.length > 0) {
          console.log(`[Database] Found ${newProductsToAdd.length} new local products to add. Smart-merging to Atlas...`);
          // Prepend new local products to preserve their order/appearance at the top
          mergedData.products = [...newProductsToAdd, ...backupProducts];
          
          await DBBackup.updateOne(
            { key: 'mgs_db_backup' },
            { data: mergedData, updatedAt: new Date() },
            { upsert: true }
          );
          console.log('[Database] MongoDB Atlas database successfully updated with merged products.');
        } else {
          console.log('[Database] No new local products to merge.');
        }

        // Write the merged data back to the server data.json
        fs.writeFileSync(dataPath, JSON.stringify(mergedData, null, 2));
        console.log('[Database] Successfully restored/merged database to local data.json.');
      } else {
        console.log('[Database] No backup found in MongoDB.');
        if (localData) {
          console.log('[Database] Seeding MongoDB Atlas with local data.json...');
          await DBBackup.updateOne(
            { key: 'mgs_db_backup' },
            { data: localData, updatedAt: new Date() },
            { upsert: true }
          );
          console.log('[Database] Successfully seeded MongoDB Atlas backup.');
        }
      }
    } catch (err) {
      console.error('[Database] MongoDB connection or restore failed:', err);
    }
  } else {
    console.log('[Database] No MONGO_URI/MONGODB_URI found. Operating in local JSON mode only.');
  }

  app.listen(PORT, () => console.log('Server running on', PORT));
};

startServer();
