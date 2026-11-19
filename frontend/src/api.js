// All the communication with the backend lives in this file.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5047'

// Builds a readable message from the ProblemDetails JSON returned by the API.
async function readError(response) {
  try {
    const problem = await response.json()
    if (problem.errors) {
      return Object.values(problem.errors).flat().join(' ')
    }
    return problem.detail ?? problem.title ?? `Request failed (${response.status})`
  } catch {
    return `Request failed (${response.status})`
  }
}

async function request(path, options = {}) {
  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch {
    throw new Error('Cannot reach the server. Is the API running?')
  }

  if (!response.ok) {
    throw new Error(await readError(response))
  }
  return response.json()
}

const send = (method, body) => ({ method, body: JSON.stringify(body) })

export const api = {
  getFranchises: () => request('/api/franchises'),
  getFranchise: (id) => request(`/api/franchises/${id}`),
  createFranchise: (name) => request('/api/franchises', send('POST', { name })),

  getBranches: (franchiseId) => request(`/api/franchises/${franchiseId}/branches`),
  getBranch: (id) => request(`/api/branches/${id}`),
  createBranch: (franchiseId, name) =>
    request(`/api/franchises/${franchiseId}/branches`, send('POST', { name })),

  getProducts: (branchId) => request(`/api/branches/${branchId}/products`),
  createProduct: (branchId, name, stock) =>
    request(`/api/branches/${branchId}/products`, send('POST', { name, stock })),
  updateStock: (productId, stock) =>
    request(`/api/products/${productId}/stock`, send('PATCH', { stock })),
}
