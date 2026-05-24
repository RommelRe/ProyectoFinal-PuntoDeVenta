import { useEffect, useState } from 'react'
import { apiFetch } from '../../services/api.js'

function getList(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.$values)) {
    return data.$values
  }

  if (Array.isArray(data?.items)) {
    return data.items
  }

  if (Array.isArray(data?.data)) {
    return data.data
  }

  return []
}

function getSaleDate(sale) {
  return (
    sale.fechaVenta ??
    sale.fecha ??
    sale.fechaCreacion ??
    sale.createdAt ??
    sale.createdDate ??
    sale.date ??
    null
  )
}

function isToday(dateValue) {
  if (!dateValue) {
    return false
  }

  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return false
  }

  const today = new Date()

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

function Dashboard() {
  const [summary, setSummary] = useState({
    productos: 0,
    clientes: 0,
    ventasHoy: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadDashboardData() {
      try {
        setLoading(true)
        setError('')

        const [productosData, clientesData, ventasData] = await Promise.all([
          apiFetch('/api/productos'),
          apiFetch('/api/clientes'),
          apiFetch('/api/ventas'),
        ])

        if (!isMounted) {
          return
        }

        const productos = getList(productosData)
        const clientes = getList(clientesData)
        const ventas = getList(ventasData)

        setSummary({
          productos: productos.length,
          clientes: clientes.length,
          ventasHoy: ventas.filter((venta) => isToday(getSaleDate(venta))).length,
        })
      } catch (fetchError) {
        if (isMounted) {
          setError(fetchError.message || 'No se pudo cargar la informacion del dashboard.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadDashboardData()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return (
      <section className="page">
        <h1>Dashboard</h1>
        <p>Cargando datos del dashboard...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="page">
        <h1>Dashboard</h1>
        <p role="alert">Error: {error}</p>
      </section>
    )
  }

  return (
    <section className="page">
      <h1>Dashboard</h1>

      <div style={styles.summaryGrid}>
        <article style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Total de productos</span>
          <strong style={styles.summaryValue}>{summary.productos}</strong>
        </article>

        <article style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Total de clientes</span>
          <strong style={styles.summaryValue}>{summary.clientes}</strong>
        </article>

        <article style={styles.summaryCard}>
          <span style={styles.summaryLabel}>Ventas del dia</span>
          <strong style={styles.summaryValue}>{summary.ventasHoy}</strong>
        </article>
      </div>
    </section>
  )
}

const styles = {
  summaryGrid: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    marginTop: '24px',
  },
  summaryCard: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '24px',
  },
  summaryLabel: {
    color: '#6b7280',
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '12px',
  },
  summaryValue: {
    color: '#111827',
    display: 'block',
    fontSize: '36px',
    lineHeight: 1,
  },
}

export default Dashboard
