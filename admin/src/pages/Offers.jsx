import React, { useState, useEffect } from 'react'
import api, { API_BASE } from '../services/api'
import { uploadImage } from '../services/uploadService'

export default function Offers() {
  const resolveImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http') || path.startsWith('blob:') || path.startsWith('data:')) return path;
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE}/${cleanPath}`;
  };

  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster: '',
    wastage: '',
    discount: '',
    extraValue: '',
    endDate: '',
    active: true
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const { data } = await api.get('/offers')
      setOffers(data)
    } catch (e) {
      console.error('Failed to fetch offers', e)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer)
      setFormData({
        title: offer.title,
        description: offer.description,
        poster: offer.poster || '',
        wastage: offer.wastage || '',
        discount: offer.discount || '',
        extraValue: offer.extraValue || '',
        endDate: offer.endDate ? offer.endDate.split('T')[0] : '',
        active: offer.active !== undefined ? offer.active : true
      })
      setPreviewUrl(offer.poster ? resolveImageUrl(offer.poster) : null)
      setSelectedFile(null)
    } else {
      setEditingOffer(null)
      setFormData({
        title: '',
        description: '',
        poster: '',
        wastage: '',
        discount: '',
        extraValue: '',
        endDate: '',
        active: true
      })
      setPreviewUrl(null)
      setSelectedFile(null)
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      let finalFormData = { ...formData }

      if (selectedFile) {
        const uploadData = new FormData()
        uploadData.append('images', selectedFile)
        const res = await uploadImage(uploadData)
        const imageUrl = res.data.url || (res.data.urls && res.data.urls[0])
        if (imageUrl) {
          finalFormData.poster = imageUrl
        }
      }

      if (editingOffer) {
        await api.put(`/offers/${editingOffer._id}`, finalFormData)
        alert('Offer updated successfully!')
      } else {
        await api.post('/offers', finalFormData)
        alert('Offer created successfully!')
      }
      fetchOffers()
      setIsModalOpen(false)
    } catch (e) {
      console.error(e)
      alert('Save failed: ' + (e.response?.data?.message || e.message))
    } finally {
      setSaving(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDelete = async (id) => {
    if (!id) return;
    
    try {
      console.log('Frontend: Attempting to delete offer', id);
      await api.delete(`/offers/${id}`);
      setOffers(prev => prev.filter(o => (o._id !== id && o.id !== id)));
      console.log('Frontend: Delete successful');
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-serif">Festival Offers</h2>
          <p className="text-sm text-gray-500 mt-1">Manage active deals and festive posters</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-lux px-6 py-2">+ Create New Offer</button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {offers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl text-gray-500 border-2 border-dashed border-gray-200">
            No active offers. Click "Create New Offer" to begin.
          </div>
        ) : (
          offers.map(offer => (
            <div key={offer._id} className="card-lux p-6 flex gap-6">
              <div className="w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                {offer.poster ? (
                  <img src={resolveImageUrl(offer.poster)} alt={offer.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Poster</div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-medium text-gray-900">{offer.title}</h3>
                  {offer.active ? (
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Active</span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Inactive</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{offer.description}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-gold/5 border border-gold/10 rounded-full">
                    <span className="text-[10px] text-gold uppercase font-bold">Wastage</span>
                    <span className="text-sm font-medium">{offer.wastage}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-100 rounded-full">
                    <span className="text-[10px] text-green-600 uppercase font-bold">Discount</span>
                    <span className="text-sm font-medium">{offer.discount}</span>
                  </div>
                  {offer.extraValue && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-full">
                      <span className="text-[10px] text-blue-600 uppercase font-bold">Old Gold</span>
                      <span className="text-sm font-medium">{offer.extraValue}</span>
                    </div>
                  )}
                  {offer.endDate && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 rounded-full">
                      <span className="text-[10px] text-red-600 uppercase font-bold">Ends</span>
                      <span className="text-sm font-medium">{new Date(offer.endDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <button onClick={() => handleOpenModal(offer)} className="p-2 text-gray-400 hover:text-gold transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                </button>
                <button 
                  onClick={() => {
                    // Temporarily bypassing confirmation to see if browser popup blocker is the issue
                    handleDelete(offer._id || offer.id);
                  }} 
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Delete Offer"
                >
                  <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-serif">{editingOffer ? 'Edit Offer' : 'Create New Offer'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="e.g. Shubh Diwali Celebration"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="Describe the offer details..."
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Offer Poster</label>
                  <div className="mt-1 flex items-center gap-4">
                    <div className="w-32 h-20 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {previewUrl ? (
                        <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                      ) : (
                        <span className="text-[10px] text-gray-400">No Image</span>
                      )}
                    </div>
                    <label className="cursor-pointer bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Select Image
                      <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wastage (e.g. 7.99%)</label>
                  <input
                    type="text"
                    value={formData.wastage}
                    onChange={(e) => setFormData({ ...formData, wastage: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (e.g. 100% OFF)</label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Extra Value (e.g. ₹200/g)</label>
                  <input
                    type="text"
                    value={formData.extraValue}
                    onChange={(e) => setFormData({ ...formData, extraValue: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="active"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 text-gold focus:ring-gold border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="text-sm font-medium text-gray-700">Set as Active Offer</label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-3 bg-gold text-white font-medium rounded-lg hover:bg-gold-dark transition-colors disabled:opacity-50">
                  {saving ? 'Saving...' : (editingOffer ? 'Update Offer' : 'Save Offer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
