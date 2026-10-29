import React, { useState, useEffect } from 'react'
import api from '../services/api'
import Card from '../components/Card'

export default function LiveRates() {
  const [rates, setRates] = useState({
    gold24: 0,
    gold22: 0,
    silver: 0,
    tickerText: '',
    manual: false
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchRates()
    
    // Auto-refresh every 60 seconds if in API mode
    const interval = setInterval(() => {
      // Use the functional update to check the LATEST manual state
      setRates(currentRates => {
        if (!currentRates.manual) {
          fetchRates()
        }
        return currentRates
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  const fetchRates = async () => {
    try {
      const { data } = await api.get('/rates')
      setRates({
        gold24: data.gold24 ? Number(data.gold24).toFixed(2) : '0',
        gold22: data.gold22 ? Number(data.gold22).toFixed(2) : '0',
        silver: data.silver ? Number(data.silver).toFixed(2) : '0',
        tickerText: data.tickerText || 'ON FESTIVAL OFFERS',
        manual: !!data.manual
      })
    } catch (e) {
      console.error('Failed to fetch rates', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    if (e) e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        gold24: Number(rates.gold24),
        gold22: Number(rates.gold22),
        silver: Number(rates.silver),
        tickerText: rates.tickerText,
        manual: true
      }
      await api.put('/rates', payload)
      setRates(prev => ({ ...prev, manual: true }))
      console.log('Rates updated successfully')
    } catch (e) {
      console.error('Failed to update rates', e)
    } finally {
      setSaving(false)
    }
  }

  const switchToAPI = async () => {
    setSaving(true)
    try {
      await api.put('/rates', { manual: false })
      await fetchRates()
      console.log('Switched to API mode')
    } catch (e) {
      console.error('Failed to switch to API mode', e)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-500">Loading rates configuration...</div>

  return (
    <div className="max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-serif text-gray-800">Live Gold & Silver Rates</h2>
          <p className="text-sm text-gray-500 mt-1">Manage how prices are displayed on the website</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${rates.manual ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${rates.manual ? 'bg-orange-500' : 'bg-green-500 animate-pulse'}`}></span>
          {rates.manual ? 'Manual Mode Active' : 'Live API Mode Active'}
        </div>
      </div>

      {!rates.manual && (
        <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-center justify-between shadow-sm">
          <div>
            <h4 className="text-green-800 font-bold text-sm">Automatic Live Price Tracking</h4>
            <p className="text-xs text-green-600">The rates below are updating automatically every minute from international markets.</p>
          </div>
          <div className="text-green-500 font-bold text-xl">⚡</div>
        </div>
      )}

      <Card>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">24K Gold Rate (per 1g)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 font-serif">₹</span>
                <input
                  type="number"
                  step="0.01"
                  value={rates.gold24}
                  onChange={(e) => setRates({ ...rates, gold24: e.target.value })}
                  readOnly={!rates.manual}
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-lg outline-none transition-all ${!rates.manual ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300 focus:ring-2 focus:ring-gold/50 focus:border-gold'}`}
                />
              </div>
              <p className="text-[10px] font-mono text-gray-400 mt-1.5 uppercase tracking-wider">10g Total: ₹{(Number(rates.gold24) * 10).toLocaleString('en-IN')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">22K Gold Rate (per 1g)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 font-serif">₹</span>
                <input
                  type="number"
                  step="0.01"
                  value={rates.gold22}
                  onChange={(e) => setRates({ ...rates, gold22: e.target.value })}
                  readOnly={!rates.manual}
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-lg outline-none transition-all ${!rates.manual ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300 focus:ring-2 focus:ring-gold/50 focus:border-gold'}`}
                />
              </div>
              <p className="text-[10px] font-mono text-gray-400 mt-1.5 uppercase tracking-wider">10g Total: ₹{(Number(rates.gold22) * 10).toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Silver Rate (per 1g)</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400 font-serif">₹</span>
              <input
                type="number"
                step="0.01"
                value={rates.silver}
                onChange={(e) => setRates({ ...rates, silver: e.target.value })}
                readOnly={!rates.manual}
                className={`w-full pl-8 pr-4 py-2.5 border rounded-lg outline-none transition-all ${!rates.manual ? 'bg-gray-50 border-gray-200 text-gray-500 cursor-not-allowed' : 'border-gray-300 focus:ring-2 focus:ring-gold/50 focus:border-gold'}`}
              />
            </div>
            <p className="text-[10px] font-mono text-gray-400 mt-1.5 uppercase tracking-wider">1kg Total: ₹{(Number(rates.silver) * 1000).toLocaleString('en-IN')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ticker Custom Message</label>
            <input
              type="text"
              value={rates.tickerText}
              onChange={(e) => setRates({ ...rates, tickerText: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold/50 focus:border-gold outline-none"
              placeholder="e.g. LOWEST WASTAGE IN DAVANAGERE"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex-1 py-3.5 font-bold rounded-lg transition-all shadow-md active:scale-[0.98] ${rates.manual ? 'bg-gold text-white hover:bg-gold-dark' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {saving ? 'UPDATING...' : (rates.manual ? 'SAVE MANUAL RATES' : 'SWITCH TO MANUAL MODE')}
            </button>
            
            {rates.manual && (
              <button
                type="button"
                onClick={switchToAPI}
                disabled={saving}
                className="flex-1 py-3.5 border-2 border-gold text-gold font-bold rounded-lg hover:bg-gold/5 transition-all shadow-sm active:scale-[0.98]"
              >
                RESTORE LIVE API MODE
              </button>
            )}
          </div>
        </div>
      </Card>
      
      <div className="mt-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl shadow-sm">
        <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
          <span>ℹ️</span> Smart Pricing Info
        </h4>
        <div className="space-y-2 text-sm text-blue-800 leading-relaxed">
          <p><strong>Live API Mode:</strong> The prices you see above are updated every 60 seconds automatically. They represent current international market rates in INR.</p>
          <p><strong>Manual Mode:</strong> Use this if you want to set your own store-specific prices. The website will stop updating automatically until you switch back.</p>
        </div>
      </div>
    </div>
  )
}
