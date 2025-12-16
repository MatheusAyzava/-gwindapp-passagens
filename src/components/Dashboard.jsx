import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import API_BASE_URL from '../config'
import Sidebar from './Sidebar'
import HeaderUser from './HeaderUser'
import './Dashboard.css'

function Dashboard({ user, onLogout }) {
  const navigate = useNavigate()
  const [solicitacoes, setSolicitacoes] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('todas')
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [solicitacoesRes, statsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/solicitacoes`),
        axios.get(`${API_BASE_URL}/api/estatisticas`)
      ])
      setSolicitacoes(solicitacoesRes.data)
      setStats(statsRes.data)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const filteredSolicitacoes = solicitacoes.filter(s => {
    const matchFilter = filter === 'todas' || s.status === filter
    const matchSearch = search === '' || 
      s.origem.toLowerCase().includes(search.toLowerCase()) ||
      s.destino.toLowerCase().includes(search.toLowerCase()) ||
      s.solicitanteNome.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  const getStatusLabel = (status) => {
    const labels = {
      pendente_gerente: 'Pendente Gerente',
      pendente_diretor: 'Pendente Diretor',
      pendente_compras: 'Pendente Compras',
      processada: 'Processada',
      rejeitada: 'Rejeitada'
    }
    return labels[status] || status
  }

  const chartData = stats ? [
    { name: 'Pendente Gerente', value: stats.pendenteGerente, color: '#f97316' },
    { name: 'Pendente Diretor', value: stats.pendenteDiretor, color: '#dc2626' },
    { name: 'Pendente Compras', value: stats.pendenteCompras, color: '#3b82f6' },
    { name: 'Processadas', value: stats.aprovadas, color: '#10b981' },
    { name: 'Rejeitadas', value: stats.rejeitadas, color: '#8b5cf6' }
  ].filter(item => item.value > 0) : []

  const getValorTotal = () => {
    return solicitacoes.reduce((total, s) => {
      if (s.vooEscolhido && s.vooEscolhido.preco) {
        return total + parseFloat(s.vooEscolhido.preco)
      }
      return total
    }, 0)
  }

  return (
    <div className="layout">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Dashboard</h1>
              <p className="page-subtitle">Visão geral das solicitações de passagens</p>
            </div>
            <div className="header-right">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/nova-solicitacao')}
              >
                + Nova Solicitação
              </button>
              <HeaderUser user={user} onLogout={onLogout} />
            </div>
          </div>
          {stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon-pending">⏱️</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.pendenteGerente + stats.pendenteDiretor + stats.pendenteCompras}</div>
                  <div className="stat-label">Pendentes</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-approved">✓</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.aprovadas}</div>
                  <div className="stat-label">Aprovadas</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-rejected">✗</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.rejeitadas}</div>
                  <div className="stat-label">Rejeitadas</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-purchase">🛒</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.pendenteCompras}</div>
                  <div className="stat-label">Em Compra</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-bought">📦</div>
                <div className="stat-content">
                  <div className="stat-value">{stats.aprovadas}</div>
                  <div className="stat-label">Compradas</div>
                </div>
              </div>
            </div>
          )}

          <div className="content-grid">
            <div className="content-main">
              <div className="card">
                <h2 className="card-title">Solicitações Recentes</h2>

          <div className="filters">
            <div className="filter-group">
              <input
                type="text"
                className="form-input"
                placeholder="Buscar por origem, destino ou solicitante..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                className="form-select"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="todas">Todas</option>
                <option value="pendente_gerente">Pendente Gerente</option>
                <option value="pendente_diretor">Pendente Diretor</option>
                <option value="pendente_compras">Pendente Compras</option>
                <option value="processada">Processadas</option>
                <option value="rejeitada">Rejeitadas</option>
              </select>
            </div>
          </div>

          <div className="solicitacoes-list">
            {filteredSolicitacoes.length === 0 ? (
              <div className="empty-state">
                <p>Nenhuma solicitação encontrada.</p>
              </div>
            ) : (
              filteredSolicitacoes.map(solicitacao => (
                <div
                  key={solicitacao.id}
                  className={`solicitacao-item ${solicitacao.status}`}
                  onClick={() => navigate(`/solicitacao/${solicitacao.id}`)}
                >
                  <div className="solicitacao-header">
                    <div className="solicitacao-user-section">
                      <div className="solicitacao-user-icon">👤</div>
                      <div className="solicitacao-user-info">
                        <div className="solicitacao-user-name">{solicitacao.solicitanteNome}</div>
                      </div>
                    </div>
                    <div className="solicitacao-info-section">
                      <div className="solicitacao-info-row">
                        <span className="info-icon">📍</span>
                        <span className="solicitacao-rota">{solicitacao.origem} → {solicitacao.destino}</span>
                      </div>
                      <div className="solicitacao-info-row">
                        <span className="info-icon">📅</span>
                        <span className="solicitacao-datas">{new Date(solicitacao.dataIda).toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>
                    <span className={`status-badge status-${solicitacao.status}`}>
                      {getStatusLabel(solicitacao.status)}
                    </span>
                  </div>
                </div>
              ))
            )}
              </div>
            </div>
            </div>
            <div className="content-sidebar">
              {stats && chartData.length > 0 && (
                <div className="card">
                  <h2 className="card-title">Distribuição por Status</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => {
                          const total = chartData.reduce((sum, item) => sum + item.value, 0)
                          const percent = total > 0 ? ((value / total) * 100).toFixed(0) : 0
                          return [`${value} (${percent}%)`, '']
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={80}
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '10px' }}
                        formatter={(value) => {
                          const total = chartData.reduce((sum, item) => sum + item.value, 0)
                          const item = chartData.find(d => d.name === value)
                          const percent = item && total > 0 ? ((item.value / total) * 100).toFixed(0) : 0
                          return `${value} ${percent}%`
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              <div className="card valor-total-card">
                <h2 className="card-title">Valor Total Estimado</h2>
                <div className="valor-total-content">
                  <div className="valor-total-value">
                    R$ {getValorTotal().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className="valor-total-subtitle">
                    Base em {solicitacoes.length} solicitação{solicitacoes.length !== 1 ? 'ões' : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

