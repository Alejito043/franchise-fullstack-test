export function Loading() {
  return <p className="status">Loading...</p>
}

export function ErrorMessage({ message }) {
  if (!message) return null
  return <p className="status error" role="alert">{message}</p>
}
