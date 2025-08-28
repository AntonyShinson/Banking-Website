import { NavLink, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle.jsx'
import { auth } from '../state/store.js'

export default function Navbar() {
  const me = auth.me()
  const navigate = useNavigate()

  return (
    <nav className="navbar-white">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <span className="navbar-logo">₦</span>
          <span>Nova Bank</span>
        </div>
        <div className="navbar-links">
          <NavLink to="/dashboard" className="nav-btn">Dashboard</NavLink>
          <NavLink to="/transactions" className="nav-btn">Transactions</NavLink>
          <NavLink to="/online" className="nav-btn">Online Banking</NavLink>
          <NavLink to="/settings" className="nav-btn">Settings</NavLink>
          <ThemeToggle />
          {me ? (
            <button className="logout-btn" onClick={() => { auth.logout(); navigate('/') }}>Logout</button>
          ) : (
            <NavLink to="/" className="login-btn">Login</NavLink>
          )}
        </div>
      </div>
    </nav>
  )
}
