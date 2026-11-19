import { useState } from 'react'
import { api } from '../api.js'
import { ErrorMessage } from './Status.jsx'

// One product with an input to change its stock.
export default function ProductRow({ product, onUpdated }) {
  const [stock, setStock] = useState(String(product.stock))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleUpdate() {
    const stockNumber = Number(stock)
    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
      setError('Stock must be a whole number greater than or equal to 0.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await api.updateStock(product.id, stockNumber)
      await onUpdated()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <li className="card product">
      <span>{product.name} (current stock: {product.stock})</span>
      <div className="inline">
        <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
        <button type="button" onClick={handleUpdate} disabled={saving}>
          {saving ? 'Saving...' : 'Update stock'}
        </button>
      </div>
      <ErrorMessage message={error} />
    </li>
  )
}
