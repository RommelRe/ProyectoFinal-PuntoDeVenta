import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/productos', label: 'Productos' },
  { to: '/categorias', label: 'Categorias' },
  { to: '/clientes', label: 'Clientes' },
  { to: '/ventas/nueva', label: 'Nueva venta' },
]

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">Sistema POS</div>

      <nav className="navbar-links" aria-label="Navegacion principal">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? 'navbar-link active' : 'navbar-link'
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}

export default Navbar
