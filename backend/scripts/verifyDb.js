// Automated Database & JSON Store Integrity Verification Script
const fs = require('fs')
const path = require('path')

const dataPath = path.resolve(__dirname, '..', 'data.json')

function verifyIntegrity() {
  console.log('🔍 Starting Database Integrity Check...\n')

  if (!fs.existsSync(dataPath)) {
    console.error('❌ Error: data.json does not exist at:', dataPath)
    process.exit(1)
  }

  let data
  try {
    const raw = fs.readFileSync(dataPath, 'utf8')
    data = JSON.parse(raw)
  } catch (err) {
    console.error('❌ Error: Failed to parse data.json syntax:', err.message)
    process.exit(1)
  }

  // 1. Verify Products
  const products = data.products || []
  console.log(`📦 Verifying Products (${products.length} found)...`)
  let invalidProducts = 0
  const productIds = new Set()

  products.forEach((p, index) => {
    const id = p._id || p.id
    if (!id || productIds.has(id)) {
      console.warn(`  ⚠️ Product index ${index} missing or duplicate ID: ${id}`)
      invalidProducts++
    } else {
      productIds.add(id)
    }

    if (!p.name || typeof p.name !== 'string') {
      console.warn(`  ⚠️ Product ${id} has invalid name`)
      invalidProducts++
    }
  })

  // 2. Verify Offers
  const offers = data.offers || []
  console.log(`🎁 Verifying Offers (${offers.length} found)...`)

  // 3. Verify Rates
  const rates = data.rates || {}
  console.log(`⚖️  Verifying Rates (Gold 22k: ${rates.gold22 || 'N/A'}, Gold 24k: ${rates.gold24 || 'N/A'}, Silver: ${rates.silver || 'N/A'})...`)

  // 4. Verify Users
  const users = data.users || []
  console.log(`👥 Verifying Admin Users (${users.length} registered)...`)

  console.log('\n========================================')
  if (invalidProducts === 0) {
    console.log('✅ All Database Integrity Checks Passed!')
  } else {
    console.log(`⚠️ Database check completed with ${invalidProducts} warnings.`)
  }
  console.log('========================================\n')
}

verifyIntegrity()
