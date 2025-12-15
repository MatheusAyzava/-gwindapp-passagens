import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from './Sidebar'
import HeaderUser from './HeaderUser'
import './Aprovacoes.css'

function Aprovacoes({ user, onLogout }) {
  const navigate = useNavigate()
  const [solicitacoesGerente, setSolicitacoesGerente] = useState([])
  const [solicitacoesDiretor, setSolicitacoesDiretor] = useState([])
  const [activeTab, setActiveTab] = useState('gerente')
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSolicitacoes()
  }, [])

  const loadSolicitacoes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/solicitacoes')
      const todas = response.data
      
      setSolicitacoesGerente(todas.filter(s => s.status === 'pendente_gerente'))
      setSolicitacoesDiretor(todas.filter(s => s.status === 'pendente_diretor'))
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error)
    }
  }

  const handleAprovar = async (solicitacao, aprovado) => {
    // Verificar se o usuário tem permissão para aprovar
    if (activeTab === 'gerente' && user.role !== 'gerente') {
      alert('Apenas gerentes podem aprovar solicitações pendentes de gerente.')
      return
    }
    if (activeTab === 'diretor' && user.role !== 'diretor') {
      alert('Apenas diretores podem aprovar solicitações pendentes de diretor.')
      return
    }
    
    setSelectedSolicitacao(solicitacao)
    setMotivo('')
    setShowModal(true)
  }

  const confirmarAprovacao = async () => {
    if (!motivo.trim()) {
      alert('Por favor, informe um motivo/comentário.')
      return
    }

    setLoading(true)
    try {
      const endpoint = activeTab === 'gerente'
        ? `/api/solicitacoes/${selectedSolicitacao.id}/aprovar-gerente`
        : `/api/solicitacoes/${selectedSolicitacao.id}/aprovar-diretor`

      await axios.post(`http://localhost:3001${endpoint}`, {
        aprovado: true,
        motivo
      })

      setShowModal(false)
      setSelectedSolicitacao(null)
      setMotivo('')
      loadSolicitacoes()
    } catch (error) {
      alert('Erro ao processar aprovação.')
    } finally {
      setLoading(false)
    }
  }

  const confirmarRejeicao = async () => {
    if (!motivo.trim()) {
      alert('Por favor, informe o motivo da rejeição.')
      return
    }

    setLoading(true)
    try {
      const endpoint = activeTab === 'gerente'
        ? `/api/solicitacoes/${selectedSolicitacao.id}/aprovar-gerente`
        : `/api/solicitacoes/${selectedSolicitacao.id}/aprovar-diretor`

      await axios.post(`http://localhost:3001${endpoint}`, {
        aprovado: false,
        motivo
      })

      setShowModal(false)
      setSelectedSolicitacao(null)
      setMotivo('')
      loadSolicitacoes()
    } catch (error) {
      alert('Erro ao processar rejeição.')
    } finally {
      setLoading(false)
    }
  }

  const getPreco = (solicitacao) => {
    if (solicitacao.vooEscolhido && solicitacao.vooEscolhido.preco) {
      return parseFloat(solicitacao.vooEscolhido.preco)
    }
    return 0
  }

  const solicitacoesAtivas = activeTab === 'gerente' ? solicitacoesGerente : solicitacoesDiretor

  return (
    <div className="layout">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Aprovações</h1>
              <p className="page-subtitle">Gerencie as solicitações pendentes</p>
            </div>
            <HeaderUser user={user} onLogout={onLogout} />
          </div>

          <div className="tabs-container">
            <button
              className={`tab-button ${activeTab === 'gerente' ? 'active' : ''}`}
              onClick={() => setActiveTab('gerente')}
            >
              Aprovação Gerente ({solicitacoesGerente.length})
            </button>
            <button
              className={`tab-button ${activeTab === 'diretor' ? 'active' : ''}`}
              onClick={() => setActiveTab('diretor')}
            >
              Aprovação Diretor ({solicitacoesDiretor.length})
            </button>
          </div>

          {solicitacoesAtivas.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma solicitação pendente de aprovação.</p>
            </div>
          ) : (
            <div className="approval-cards-grid">
              {solicitacoesAtivas.map(solicitacao => (
                <div key={solicitacao.id} className="approval-card">
                  <div className="approval-card-header">
                    <div className="approval-user-info">
                      <div className="approval-user-name">{solicitacao.solicitanteNome}</div>
                      <div className="approval-user-email">{solicitacao.solicitanteEmail || 'sem email'}</div>
                    </div>
                    <span className="status-badge-pending">
                      <span className="status-icon">⏱️</span>
                      Pendente
                    </span>
                  </div>
                  
                  <div className="approval-card-body">
                    <div className="approval-info-row">
                      <span className="info-icon">📍</span>
                      <span className="info-label">Rota:</span>
                      <span className="info-value">{solicitacao.origem} → {solicitacao.destino}</span>
                    </div>
                    
                    <div className="approval-info-row">
                      <span className="info-icon">📅</span>
                      <span className="info-label">Data:</span>
                      <span className="info-value">{new Date(solicitacao.dataIda).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <div className="approval-info-row">
                      <span className="info-icon">💰</span>
                      <span className="info-label">Valor:</span>
                      <span className="info-value price-value">
                        R$ {getPreco(solicitacao).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    
                    <div className="approval-info-row">
                      <span className="info-icon">📝</span>
                      <span className="info-label">Motivo:</span>
                      <span className="info-value">{solicitacao.justificativa}</span>
                    </div>
                  </div>

                  <div className="approval-card-actions">
                    <button
                      className="btn-approve"
                      onClick={() => handleAprovar(solicitacao, true)}
                    >
                      <span className="btn-icon">✓</span>
                      Aprovar
                    </button>
                    <button
                      className="btn-reject"
                      onClick={() => handleAprovar(solicitacao, false)}
                    >
                      <span className="btn-icon">✗</span>
                      Rejeitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {selectedSolicitacao && (
                  <>
                    {selectedSolicitacao.origem} → {selectedSolicitacao.destino}
                  </>
                )}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">
                Motivo/Comentário *
              </label>
              <textarea
                className="form-textarea"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Informe o motivo da aprovação ou rejeição..."
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-success"
                onClick={confirmarAprovacao}
                disabled={loading}
              >
                Confirmar Aprovação
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmarRejeicao}
                disabled={loading}
              >
                Confirmar Rejeição
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
                disabled={loading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Aprovacoes
