import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'
import { useLoad } from '../hooks/useLoad.js'
import { ErrorMessage, Loading } from '../components/Status.jsx'
import NameForm from '../components/NameForm.jsx'

export default function FranchisesPage() {
  const loader = useCallback(() => api.getFranchises(), [])
  const { data: franchises, loading, error, reload } = useLoad(loader)

  async function handleCreate(name) {
    await api.createFranchise(name)
    await reload()
  }

  return (
    <section>
      <h1>Franchises</h1>
      <NameForm label="New franchise name" onSubmit={handleCreate} />

      {loading && <Loading />}
      <ErrorMessage message={error} />

      {franchises && franchises.length === 0 && <p>No franchises yet.</p>}
      <ul className="list">
        {franchises?.map((franchise) => (
          <li key={franchise.id} className="card">
            <span>{franchise.name}</span>
            <Link to={`/franchises/${franchise.id}/branches`}>View branches</Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
