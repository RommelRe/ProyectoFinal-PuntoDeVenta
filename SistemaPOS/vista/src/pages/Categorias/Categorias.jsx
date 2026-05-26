import { useEffect, useState } from 'react'
import { apiFetch } from '../../services/api.js'

const initialForm = {
  nombre: '',
  descripcion: '',
}

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingCategory, setEditingCategory] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadCategorias() {
    try {
      setIsLoading(true)
      setError('')
      const data = await apiFetch('/api/categorias')
      setCategorias(data)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCategorias()
  }, [])

  function openCreateModal() {
    setEditingCategory(null)
    setForm(initialForm)
    setError('')
    setIsModalOpen(true)
  }

  function openEditModal(categoria) {
    setEditingCategory(categoria)
    setForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion ?? '',
    })
    setError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingCategory(null)
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
      descripcion: form.descripcion.trim(),
    }

    try {
      setIsSaving(true)
      setError('')

      if (editingCategory) {
        await apiFetch(`/api/categorias/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      } else {
        await apiFetch('/api/categorias', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
      }

      await loadCategorias()
      closeModal()
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(categoria) {
    const confirmed = window.confirm(
      `¿Eliminar la categoría "${categoria.nombre}"?`,
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      await apiFetch(`/api/categorias/${categoria.id}`, {
        method: 'DELETE',
      })
      await loadCategorias()
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  return (
    <section className="page management-page">
      <div className="page-header">
        <div>
          <h1>Categorías</h1>
          <p>Listado y administración de categorías.</p>
        </div>
        <button className="button button-primary" onClick={openCreateModal}>
          Nueva categoría
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="3" className="empty-cell">
                  Cargando categorías...
                </td>
              </tr>
            ) : categorias.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-cell">
                  No hay categorías registradas.
                </td>
              </tr>
            ) : (
              categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.descripcion || 'Sin descripción'}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="button button-secondary"
                        onClick={() => openEditModal(categoria)}
                      >
                        Editar
                      </button>
                      <button
                        className="button button-danger"
                        onClick={() => handleDelete(categoria)}
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
              <h2>{editingCategory ? 'Editar categoría' : 'Nueva categoría'}</h2>
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
                Descripción
                <textarea
                  name="descripcion"
                  value={form.descripcion}
                  onChange={handleChange}
                  rows="4"
                />
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

export default Categorias
