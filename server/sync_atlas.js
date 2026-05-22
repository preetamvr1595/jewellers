require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'data.json');

async function sync() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    console.error('ERROR: No MONGO_URI or MONGODB_URI found in .env file!');
    process.exit(1);
  }

  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas successfully.');

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

    console.log('Reading local server/data.json...');
    const localData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

    console.log('Updating DBBackup in MongoDB Atlas with 129 new premium gold/diamond pieces...');
    const result = await DBBackup.updateOne(
      { key: 'mgs_db_backup' },
      { data: localData, updatedAt: new Date() },
      { upsert: true }
    );

    console.log('MongoDB Atlas backup successfully updated!');
    console.log('Result:', result);
    
    console.log('\nSuccess! Now the live website will load the updated database on its next start or when fetching products.');
    process.exit(0);
  } catch (err) {
    console.error('Database sync failed:', err);
    process.exit(1);
  }
}

sync();
