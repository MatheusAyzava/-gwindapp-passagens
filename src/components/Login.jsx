import { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        email,
        password
      })

      if (response.data.success) {
        onLogin(response.data.user)
      } else {
        setError(response.data.message || 'Credenciais inválidas')
      }
    } catch (err) {
      if (err.code === 'ECONNREFUSED' || err.message.includes('Network Error')) {
        setError('Servidor não está rodando. Verifique se o servidor foi iniciado.')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('Erro ao fazer login. Verifique suas credenciais e se o servidor está rodando.')
      }
      console.error('Erro no login:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🚀 Sistema de Solicitações</h1>
          <p>Faça login para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="login-info">
          <p><strong>Usuários de teste:</strong></p>
          <ul>
            <li>Colaborador: joao@empresa.com / 123</li>
            <li>Gerente: maria@empresa.com / 123</li>
            <li>Diretor: pedro@empresa.com / 123</li>
            <li>Compras: ana@empresa.com / 123</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Login





