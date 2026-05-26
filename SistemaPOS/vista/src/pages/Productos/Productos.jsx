import { useEffect, useState } from 'react'
import { apiFetch } from '../../services/api.js'

const initialForm = {
  nombre: '',
  precio: '',
  stock: '',
  categoriaId: '',
}

function Productos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadProductos() {
    const data = await apiFetch('/api/productos')
    setProductos(data)
  }

  async function loadCategorias() {
    const data = await apiFetch('/api/categorias')
    setCategorias(data)
  }

  async function loadData() {
    try {
      setIsLoading(true)
      setError('')
      await Promise.all([loadProductos(), loadCategorias()])
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  function openCreateModal() {
    setEditingProduct(null)
    setForm(initialForm)
    setError('')
    setIsModalOpen(true)
  }

  function openEditModal(producto) {
    setEditingProduct(producto)
    setForm({
      nombre: producto.nombre,
      precio: String(producto.precio),
      stock: String(producto.stock),
      categoriaId: String(producto.categoriaId),
    })
    setError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingProduct(null)
    setForm(initialForm)
    setIsSaving(false)
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      nombre: form.nombre.trim(),
      precio: Number(form.precio),
      stock: Number(form.stock),
      categoriaId: Number(form.categoriaId),
    }

    try {
      setIsSaving(true)
      setError('')

      if (editingProduct) {
        await apiFetch(`/api/productos/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiFetch('/api/productos', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      await loadProductos()
      closeModal()
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(producto) {
    const confirmed = window.confirm(
      `¿Eliminar el producto "${producto.nombre}"?`,
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      await apiFetch(`/api/productos/${producto.id}`, {
        method: 'DELETE',
      })
      await loadProductos()
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  return (
    <section className="page management-page">
      <div className="page-header">
        <div>
          <h1>Productos</h1>
          <p>Listado y administración de productos.</p>
        </div>
        <button className="button button-primary" onClick={openCreateModal}>
          Nuevo producto
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="empty-cell">
                  Cargando productos...
                </td>
              </tr>
            ) : productos.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">
                  No hay productos registrados.
                </td>
              </tr>
            ) : (
              productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.nombre}</td>
                  <td>
                    {Number(producto.precio).toLocaleString('es-MX', {
                      style: 'currency',
                      currency: 'MXN',
                    })}
                  </td>
                  <td>{producto.stock}</td>
                  <td>{producto.categoriaNombre}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="button button-secondary"
                        onClick={() => openEditModal(producto)}
                      >
                        Editar
                      </button>
                      <button
                        className="button button-danger"
                        onClick={() => handleDelete(producto)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true">
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button
                className="icon-button"
                type="button"
                aria-label="Cerrar"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form className="entity-form" onSubmit={handleSubmit}>
              <label>
                Nombre
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  maxLength="150"
                />
              </label>

              <label>
                Precio
                <input
                  name="precio"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.precio}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Stock
                <input
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Categoría
                <select
                  name="categoriaId"
                  value={form.categoriaId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <div className="modal-actions">
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}

export default Productos
