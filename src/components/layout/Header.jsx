import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <span className="brand-badge">CC</span>
          <div>
            <p className="brand-title">Proyecto Cesta</p>
            <small>Northwind + MetaMask</small>
          </div>
        </div>
        <nav className="main-nav">
          <NavLink to="/productos">Productos</NavLink>
          <NavLink to="/cesta">Cesta</NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
