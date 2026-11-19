import { useCallback, useEffect, useState } from 'react'

// Runs an async loader and exposes { data, loading, error, reload }.
// The loader must be stable (wrap it with useCallback).
export function useLoad(loader) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setData(await loader())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [loader])

  useEffect(() => {
    reload()
  }, [reload])

  return { data, loading, error, reload }
}
