import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api.js'
import { useLoad } from '../hooks/useLoad.js'
import { ErrorMessage, Loading } from '../components/Status.jsx'
import NameForm from '../components/NameForm.jsx'

export default function BranchesPage() {
  const { franchiseId } = useParams()

  const loader = useCallback(async () => {
    const [franchise, branches] = await Promise.all([
      api.getFranchise(franchiseId),
      api.getBranches(franchiseId),
    ])
    return { franchise, branches }
  }, [franchiseId])
  const { data, loading, error, reload } = useLoad(loader)

  async function handleCreate(name) {
    await api.createBranch(franchiseId, name)
    await reload()
  }

  return (
    <section>
      <Link to="/">&larr; Back to franchises</Link>
      <h1>Branches{data ? ` of ${data.franchise.name}` : ''}</h1>

      {loading && <Loading />}
      <ErrorMessage message={error} />

      {data && (
        <>
          <NameForm label="New branch name" onSubmit={handleCreate} />
          {data.branches.length === 0 && <p>No branches yet.</p>}
          <ul className="list">
            {data.branches.map((branch) => (
              <li key={branch.id} className="card">
                <span>{branch.name}</span>
                <Link to={`/branches/${branch.id}/products`}>View products</Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}
