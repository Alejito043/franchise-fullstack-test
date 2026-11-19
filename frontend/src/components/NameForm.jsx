import { useState } from 'react'
import { ErrorMessage } from './Status.jsx'

// Small form used to create franchises and branches (they only have a name).
export default function NameForm({ label, onSubmit }) {
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSubmit(name.trim())
      setName('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="card form" onSubmit={handleSubmit}>
      <label>
        {label}
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
      </label>
      <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Create'}</button>
      <ErrorMessage message={error} />
    </form>
  )
}
