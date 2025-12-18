import { useNavigate, useLocation } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const getNavLinks = () => {
    return [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/nova-solicitacao', label: 'Nova Solicitação', icon: '+' },
      { path: '/aprovacoes', label: 'Aprovações', icon: '✓' },
      { path: '/compras', label: 'Compras', icon: '🛒' }
    ]
  }

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">✈️</div>
          <div className="logo-text">
            <div className="logo-title">Gwind Air</div>
            <div className="logo-subtitle">Sistema de Passagens</div>
          </div>
        </div>
      </div>

      <div className="sidebar-menu">
        <div className="menu-section">
          <div className="menu-title">MENU PRINCIPAL</div>
          {getNavLinks().map(link => (
            <div
              key={link.path}
              className={`menu-item ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => navigate(link.path)}
            >
              <span className="menu-icon">{link.icon}</span>
              <span className="menu-label">{link.label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Sidebar





