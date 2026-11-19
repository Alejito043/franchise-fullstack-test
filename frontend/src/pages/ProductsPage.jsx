import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { useLoad } from '../hooks/useLoad.js'
import { ErrorMessage, Loading } from '../components/Status.jsx'
import ProductRow from '../components/ProductRow.jsx'

export default function ProductsPage() {
  const { branchId } = useParams()

  const loader = useCallback(async () => {
    const [branch, products] = await Promise.all([
      api.getBranch(branchId),
      api.getProducts(branchId),
    ])
    return { branch, products }
  }, [branchId])
  const { data, loading, error, reload } = useLoad(loader)

  const [name, setName] = useState('')
  const [stock, setStock] = useState('0')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  async function handleCreate(event) {
    event.preventDefault()
    const stockNumber = Number(stock)
    if (!name.trim()) {
      setFormError('Name is required.')
      return
    }
    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
      setFormError('Stock must be a whole number greater than or equal to 0.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      await api.createProduct(branchId, name.trim(), stockNumber)
      setName('')
      setStock('0')
      await reload()
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      {data && (
        <Link to={`/franchises/${data.branch.franchiseId}/branches`}>&larr; Back to branches</Link>
      )}
      <h1>Products{data ? ` of ${data.branch.name}` : ''}</h1>

      {loading && <Loading />}
      <ErrorMessage message={error} />

      {data && (
        <>
          <form className="card form" onSubmit={handleCreate}>
            <label>
              New product name
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            </label>
            <label>
              Stock
              <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} />
            </label>
            <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
            <ErrorMessage message={formError} />
          </form>

          {data.products.length === 0 && <p>No products yet.</p>}
          <ul className="list">
            {data.products.map((product) => (
              <ProductRow key={product.id} product={product} onUpdated={reload} />
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
