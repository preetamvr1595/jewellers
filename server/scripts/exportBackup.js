// Database Snapshot & Export Utility
const fs = require('fs')
const path = require('path')

const dataPath = path.resolve(__dirname, '..', 'data.json')
const backupDir = path.resolve(__dirname, '..', 'backups')

function exportBackup() {
  if (!fs.existsSync(dataPath)) {
    console.error('❌ Cannot export backup: data.json does not exist.')
    process.exit(1)
  }

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const destPath = path.join(backupDir, `backup-${timestamp}.json`)

  fs.copyFileSync(dataPath, destPath)
  console.log(`✅ Database backup successfully created at: ${destPath}`)
}

exportBackup()
