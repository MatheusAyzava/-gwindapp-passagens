import './HeaderUser.css'

function HeaderUser({ user, onLogout }) {
  return (
    <div className="user-profile-header">
      <div className="user-avatar-header">{user.name.charAt(0).toUpperCase()}</div>
      <div className="user-info-header">
        <div className="user-name-header">{user.name}</div>
        <div className="user-role-header">
          {user.role === 'colaborador' ? 'Colaborador' :
           user.role === 'gerente' ? 'Gerente' :
           user.role === 'diretor' ? 'Diretor' :
           user.role === 'compras' ? 'Compras' : user.role}
        </div>
      </div>
      <button className="btn-logout-header" onClick={onLogout} title="Sair">
        Sair
      </button>
    </div>
  )
}

export default HeaderUser




