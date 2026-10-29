const axios = require('axios')
const storage = require('../storage')

let cache = {
  data: null,
  timestamp: 0
}

const CACHE_DURATION = 2 * 60 * 1000

exports.getRates = async (req, res) => {
  // Check if we have manually set rates first
  const savedRates = storage.getRates()
  if (savedRates && savedRates.manual) {
    return res.json(savedRates)
  }

  // If in API mode, use cache if fresh
  const now = Date.now()
  if (cache.data && (now - cache.timestamp < CACHE_DURATION)) {
    return res.json({ ...cache.data, manual: false })
  }

  try {
    const apiKey = process.env.GOLD_API_KEY
    let data = null

    if (apiKey && apiKey !== 'replace_with_your_goldpricez_api_key') {
      try {
        const response = await axios.get('https://api.goldpricez.com/v1/rates/INR', {
          headers: { 'X-API-KEY': apiKey },
          timeout: 5000
        })
        if (response.data) {
          data = {
            gold24: response.data.gold24k_10g / 10 || 7490,
            gold22: response.data.gold22k_10g / 10 || 6842,
            silver: response.data.silver_kg / 1000 || 89.20,
            tickerText: savedRates.tickerText || 'ON FESTIVAL OFFERS',
            updatedAt: new Date().toISOString(),
            manual: false
          }
        }
      } catch (apiErr) {
        console.error('External Gold API failed, using mock data:', apiErr.message)
      }
    }

    // Fallback to randomized mock data if API fails or no key
    // Using current 2026 India market rates (Davanagere/Karnataka)
    if (!data) {
      const base24k = 15656; // 24K per gram
      const base22k = 14910; // 22K per gram
      const baseSilver = 292; // Silver per gram

      data = {
        gold24: base24k + (Math.random() * 10 - 5),
        gold22: base22k + (Math.random() * 10 - 5),
        silver: baseSilver + (Math.random() * 2 - 1),
        tickerText: savedRates.tickerText || 'ON FESTIVAL OFFERS',
        updatedAt: new Date().toISOString(),
        manual: false
      }
    }

    cache = { data, timestamp: now }
    res.json(data)
  } catch (error) {
    console.error('General Rate Error:', error.message)
    // Absolute final fallback to prevent crash/NaN (2026 India Rates)
    const fallback = { 
      gold24: 15656, 
      gold22: 14910, 
      silver: 292, 
      tickerText: 'ON FESTIVAL OFFERS', 
      updatedAt: new Date().toISOString(), 
      manual: false 
    }
    res.json(cache.data || fallback)
  }
}

exports.updateRates = (req, res) => {
  const { gold24, gold22, silver, tickerText, manual } = req.body
  
  // If explicitly setting manual to false, we just update the flag
  if (manual === false) {
    const current = storage.getRates()
    const data = { 
      ...current, 
      manual: false, 
      lastUpdated: new Date().toISOString() 
    }
    storage.setRates(data)
    return res.json(data)
  }

  const data = { 
    gold24, 
    gold22, 
    silver, 
    tickerText,
    manual: true,
    lastUpdated: new Date().toISOString() 
  }
  storage.setRates(data)
  res.json(data)
}