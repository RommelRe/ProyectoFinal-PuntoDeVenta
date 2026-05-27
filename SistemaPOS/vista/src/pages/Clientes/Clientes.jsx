import { useEffect, useState } from 'react'
import {
  createCliente,
  deleteCliente,
  getClientes,
  updateCliente,
} from '../../services/api.js'

const initialForm = {
  nombre: '',
  telefono: '',
  email: '',
}

function Clientes() {
  const [clientes, setClientes] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingClient, setEditingClient] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  async function loadClientes() {
    try {
      setIsLoading(true)
      setError('')
      const data = await getClientes()
      setClientes(data)
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let ignore = false

    async function fetchClientes() {
      try {
        const data = await getClientes()

        if (!ignore) {
          setClientes(data)
        }
      } catch (apiError) {
        if (!ignore) {
          setError(apiError.message)
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    fetchClientes()

    return () => {
      ignore = true
    }
  }, [])

  function openCreateModal() {
    setEditingClient(null)
    setForm(initialForm)
    setError('')
    setIsModalOpen(true)
  }

  function openEditModal(cliente) {
    setEditingClient(cliente)
    setForm({
      nombre: cliente.nombre,
      telefono: cliente.telefono ?? '',
      email: cliente.email ?? '',
    })
    setError('')
    setIsModalOpen(true)
  }

  function closeModal() {
    setIsModalOpen(false)
    setEditingClient(null)
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
      telefono: form.telefono.trim(),
      email: form.email.trim(),
    }

    try {
      setIsSaving(true)
      setError('')

      if (editingClient) {
        await updateCliente(editingClient.id, payload)
      } else {
        await createCliente(payload)
      }

      await loadClientes()
      closeModal()
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDelete(cliente) {
    const confirmed = window.confirm(
      `¿Eliminar el cliente "${cliente.nombre}"?`,
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')
      await deleteCliente(cliente.id)
      await loadClientes()
    } catch (apiError) {
      setError(apiError.message)
    }
  }

  return (
    <section className="page management-page">
      <div className="page-header">
        <div>
          <h1>Clientes</h1>
          <p>Listado y administración de clientes.</p>
        </div>
        <button className="button button-primary" onClick={openCreateModal}>
          Nuevo cliente
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" className="empty-cell">
                  Cargando clientes...
                </td>
              </tr>
            ) : clientes.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-cell">
                  No hay clientes registrados.
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.telefono || 'Sin teléfono'}</td>
                  <td>{cliente.email || 'Sin email'}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        className="button button-secondary"
                        onClick={() => openEditModal(cliente)}
                      >
                        Editar
                      </button>
                      <button
                        className="button button-danger"
                        onClick={() => handleDelete(cliente)}
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
              <h2>{editingClient ? 'Editar cliente' : 'Nuevo cliente'}</h2>
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
                Teléfono
                <input
                  name="telefono"
                  type="tel"
                  value={form.telefono}
                  onChange={handleChange}
                  maxLength="30"
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  maxLength="150"
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

export default Clientes
