import React, { useState, useEffect } from 'react'
import api from '../services/api'

export default function ContentManagement() {
  const [settings, setSettings] = useState({
    heroTitle: 'Generations of Trust, Crafted in Gold',
    heroSubtitle: 'Davanagere\'s legacy of pure craftsmanship. BIS & HUID certified.',
    wastageRate: '7.99',
    makingChargeOff: '100',
    goldApiKey: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings')
      setSettings(prev => ({ ...prev, ...data }))
    } catch (e) {
      console.error('Failed to fetch settings', e)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await Promise.all(
        Object.entries(settings).map(([key, value]) => 
          api.post('/settings', { key, value })
        )
      )
      alert('Settings updated successfully!')
    } catch (e) {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-serif">Content Management</h2>
      <p className="text-gray-600 mt-2">Update homepage content and global settings.</p>
      
      <form onSubmit={handleSave} className="mt-8 space-y-6">
        <div className="card-lux p-6 space-y-4">
          <h3 className="text-lg font-medium border-b border-gray-100 pb-2">Hero Section</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hero Title</label>
            <textarea 
              className="input-lux mt-1" 
              rows="2"
              value={settings.heroTitle}
              onChange={e => setSettings({...settings, heroTitle: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
            <textarea 
              className="input-lux mt-1" 
              rows="3"
              value={settings.heroSubtitle}
              onChange={e => setSettings({...settings, heroSubtitle: e.target.value})}
            />
          </div>
        </div>

        <div className="card-lux p-6 space-y-4">
          <h3 className="text-lg font-medium border-b border-gray-100 pb-2">Global Rates & Ticker</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Wastage Rate (%)</label>
              <input 
                type="text" 
                className="input-lux mt-1" 
                value={settings.wastageRate}
                onChange={e => setSettings({...settings, wastageRate: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Making Charge Discount (%)</label>
              <input 
                type="text" 
                className="input-lux mt-1" 
                value={settings.makingChargeOff}
                onChange={e => setSettings({...settings, makingChargeOff: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">GoldPriceZ API Key (Optional)</label>
            <input 
              type="password" 
              className="input-lux mt-1" 
              placeholder="Leave blank to use simulation"
              value={settings.goldApiKey}
              onChange={e => setSettings({...settings, goldApiKey: e.target.value})}
            />
            <p className="text-xs text-gray-500 mt-1">If blank, the site will use simulated live rates.</p>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={saving}
            className="btn-lux px-8 py-2"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
