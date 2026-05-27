import { useEffect, useMemo, useState } from 'react'
import {
  createVenta,
  getClientes,
  getProductos,
} from '../../services/api.js'

function NuevaVenta() {
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [clienteId, setClienteId] = useState('')
  const [productoId, setProductoId] = useState('')
  const [cantidad, setCantidad] = useState('1')
  const [detalles, setDetalles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const total = useMemo(
    () =>
      detalles.reduce(
        (sum, detalle) => sum + Number(detalle.precio) * detalle.cantidad,
        0,
      ),
    [detalles],
  )

  useEffect(() => {
    let ignore = false

    async function loadData() {
      try {
        const [clientesData, productosData] = await Promise.all([
          getClientes(),
          getProductos(),
        ])

        if (!ignore) {
          setClientes(clientesData)
          setProductos(productosData)
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

    loadData()

    return () => {
      ignore = true
    }
  }, [])

  function formatCurrency(value) {
    return Number(value).toLocaleString('es-MX', {
      style: 'currency',
      currency: 'MXN',
    })
  }

  function handleAddProduct(event) {
    event.preventDefault()

    const selectedProduct = productos.find(
      (producto) => producto.id === Number(productoId),
    )
    const selectedQuantity = Number(cantidad)

    setSuccess('')

    if (!selectedProduct) {
      setError('Selecciona un producto.')
      return
    }

    if (!Number.isInteger(selectedQuantity) || selectedQuantity < 1) {
      setError('La cantidad debe ser mayor a cero.')
      return
    }

    setDetalles((currentDetails) => {
      const existingDetail = currentDetails.find(
        (detalle) => detalle.productoId === selectedProduct.id,
      )

      if (existingDetail) {
        return currentDetails.map((detalle) =>
          detalle.productoId === selectedProduct.id
            ? {
                ...detalle,
                cantidad: detalle.cantidad + selectedQuantity,
              }
            : detalle,
        )
      }

      return [
        ...currentDetails,
        {
          productoId: selectedProduct.id,
          nombre: selectedProduct.nombre,
          precio: selectedProduct.precio,
          cantidad: selectedQuantity,
        },
      ]
    })

    setError('')
    setProductoId('')
    setCantidad('1')
  }

  function handleRemoveProduct(productoIdToRemove) {
    setDetalles((currentDetails) =>
      currentDetails.filter(
        (detalle) => detalle.productoId !== productoIdToRemove,
      ),
    )
    setSuccess('')
  }

  async function handleConfirmSale() {
    if (!clienteId) {
      setSuccess('')
      setError('Selecciona un cliente antes de confirmar la venta.')
      return
    }

    if (detalles.length === 0) {
      setSuccess('')
      setError('Agrega al menos un producto antes de confirmar la venta.')
      return
    }

    const payload = {
      clienteId: Number(clienteId),
      detalles: detalles.map((detalle) => ({
        productoId: detalle.productoId,
        cantidad: detalle.cantidad,
      })),
    }

    try {
      setIsSaving(true)
      setError('')
      setSuccess('')

      await createVenta(payload)

      setClienteId('')
      setProductoId('')
      setCantidad('1')
      setDetalles([])
      setSuccess('Venta confirmada correctamente.')
    } catch (apiError) {
      setError(apiError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="page management-page">
      <div className="page-header">
        <div>
          <h1>Nueva Venta</h1>
          <p>Captura de una nueva venta.</p>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && (
        <div
          className="alert"
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
          }}
        >
          {success}
        </div>
      )}

      <form className="entity-form" onSubmit={handleAddProduct}>
        <label>
          Cliente
          <select
            value={clienteId}
            onChange={(event) => {
              setClienteId(event.target.value)
              setSuccess('')
            }}
            disabled={isLoading}
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </label>

        <label>
          Producto
          <select
            value={productoId}
            onChange={(event) => setProductoId(event.target.value)}
            disabled={isLoading}
          >
            <option value="">Selecciona un producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre} - {formatCurrency(producto.precio)}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cantidad
          <input
            type="number"
            min="1"
            step="1"
            value={cantidad}
            onChange={(event) => setCantidad(event.target.value)}
            disabled={isLoading}
          />
        </label>

        <div className="modal-actions">
          <button
            className="button button-primary"
            type="submit"
            disabled={isLoading}
          >
            Agregar
          </button>
        </div>
      </form>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" className="empty-cell">
                  Cargando información...
                </td>
              </tr>
            ) : detalles.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-cell">
                  No hay productos agregados.
                </td>
              </tr>
            ) : (
              detalles.map((detalle) => (
                <tr key={detalle.productoId}>
                  <td>{detalle.nombre}</td>
                  <td>{formatCurrency(detalle.precio)}</td>
                  <td>{detalle.cantidad}</td>
                  <td>{formatCurrency(Number(detalle.precio) * detalle.cantidad)}</td>
                  <td>
                    <button
                      className="button button-danger"
                      type="button"
                      onClick={() => handleRemoveProduct(detalle.productoId)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="page-header">
        <div>
          <h2 style={{ margin: 0 }}>Total: {formatCurrency(total)}</h2>
        </div>
        <button
          className="button button-primary"
          type="button"
          onClick={handleConfirmSale}
          disabled={isSaving || isLoading}
        >
          {isSaving ? 'Confirmando...' : 'Confirmar venta'}
        </button>
      </div>
    </section>
  )
}

export default NuevaVenta
