import { Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard/index.jsx'
import Productos from './pages/Productos/index.jsx'
import Categorias from './pages/Categorias/index.jsx'
import Clientes from './pages/Clientes/index.jsx'
import NuevaVenta from './pages/NuevaVenta/index.jsx'

function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/ventas/nueva" element={<NuevaVenta />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
