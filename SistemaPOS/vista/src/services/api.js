export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`Error ${response.status} al llamar al API`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}
