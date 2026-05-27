export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://localhost:7000'

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

export function getProductos() {
  return apiFetch('/api/productos')
}

export function getProducto(id) {
  return apiFetch(`/api/productos/${id}`)
}

export function createProducto(data) {
  return apiFetch('/api/productos', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateProducto(id, data) {
  return apiFetch(`/api/productos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteProducto(id) {
  return apiFetch(`/api/productos/${id}`, {
    method: 'DELETE',
  })
}

export function getCategorias() {
  return apiFetch('/api/categorias')
}

export function getCategoria(id) {
  return apiFetch(`/api/categorias/${id}`)
}

export function createCategoria(data) {
  return apiFetch('/api/categorias', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateCategoria(id, data) {
  return apiFetch(`/api/categorias/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteCategoria(id) {
  return apiFetch(`/api/categorias/${id}`, {
    method: 'DELETE',
  })
}

export function getClientes() {
  return apiFetch('/api/clientes')
}

export function getCliente(id) {
  return apiFetch(`/api/clientes/${id}`)
}

export function createCliente(data) {
  return apiFetch('/api/clientes', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateCliente(id, data) {
  return apiFetch(`/api/clientes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteCliente(id) {
  return apiFetch(`/api/clientes/${id}`, {
    method: 'DELETE',
  })
}

export function getVentas() {
  return apiFetch('/api/ventas')
}

export function getVenta(id) {
  return apiFetch(`/api/ventas/${id}`)
}

export function createVenta(data) {
  return apiFetch('/api/ventas', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
