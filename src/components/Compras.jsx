import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Sidebar from './Sidebar'
import HeaderUser from './HeaderUser'
import './Compras.css'

function Compras({ user, onLogout }) {
  const navigate = useNavigate()
  const [solicitacoes, setSolicitacoes] = useState([])
  const [selectedSolicitacao, setSelectedSolicitacao] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [observacoes, setObservacoes] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadSolicitacoes()
  }, [])

  const loadSolicitacoes = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/solicitacoes')
      setSolicitacoes(response.data)
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error)
    }
  }

  const handleProcessar = (solicitacao) => {
    setSelectedSolicitacao(solicitacao)
    setObservacoes('')
    setShowModal(true)
  }

  const confirmarProcessamento = async () => {
    setLoading(true)
    try {
      await axios.post(`http://localhost:3001/api/solicitacoes/${selectedSolicitacao.id}/processar-compras`, {
        processado: true,
        observacoes
      })

      setShowModal(false)
      setSelectedSolicitacao(null)
      setObservacoes('')
      loadSolicitacoes()
    } catch (error) {
      alert('Erro ao processar solicitação.')
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

  const aguardandoCompra = solicitacoes.filter(s => s.status === 'pendente_compras')
  const emProcesso = solicitacoes.filter(s => s.status === 'processando_compras')
  const finalizadas = solicitacoes.filter(s => s.status === 'processada')

  return (
    <div className="layout">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Compras</h1>
              <p className="page-subtitle">Gerencie as compras de passagens</p>
            </div>
            <HeaderUser user={user} onLogout={onLogout} />
          </div>

          <div className="compras-sections">
            {/* Aguardando Compra */}
            <div className="compras-section">
              <div className="section-header">
                <span className="section-icon">🛒</span>
                <h2 className="section-title">Aguardando Compra ({aguardandoCompra.length})</h2>
              </div>
              <div className="section-content">
                {aguardandoCompra.length === 0 ? (
                  <div className="empty-state-card">
                    <div className="empty-icon">🛒</div>
                    <p>Nenhuma solicitação aguardando compra</p>
                  </div>
                ) : (
                  <div className="compras-cards-grid">
                    {aguardandoCompra.map(solicitacao => (
                      <div key={solicitacao.id} className="compra-card">
                        <div className="compra-card-header">
                          <div className="compra-user-info">
                            <div className="compra-user-name">{solicitacao.solicitanteNome}</div>
                            <div className="compra-user-email">{solicitacao.solicitanteEmail || 'sem email'}</div>
                          </div>
                          <span className="status-badge-pending">
                            <span className="status-icon">⏱️</span>
                            Pendente
                          </span>
                        </div>
                        <div className="compra-card-body">
                          <div className="compra-info-row">
                            <span className="info-icon">📍</span>
                            <span className="info-label">Rota:</span>
                            <span className="info-value">{solicitacao.origem} → {solicitacao.destino}</span>
                          </div>
                          <div className="compra-info-row">
                            <span className="info-icon">📅</span>
                            <span className="info-label">Data:</span>
                            <span className="info-value">{new Date(solicitacao.dataIda).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="compra-info-row">
                            <span className="info-icon">💰</span>
                            <span className="info-label">Valor Estimado:</span>
                            <span className="info-value price-value">
                              R$ {getPreco(solicitacao).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                        <div className="compra-card-actions">
                          <button
                            className="btn btn-primary"
                            onClick={() => handleProcessar(solicitacao)}
                          >
                            Processar Compra
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Em Processo de Compra */}
            <div className="compras-section">
              <div className="section-header">
                <span className="section-icon">📦</span>
                <h2 className="section-title">Em Processo de Compra ({emProcesso.length})</h2>
              </div>
              <div className="section-content">
                {emProcesso.length === 0 ? (
                  <div className="empty-state-card">
                    <div className="empty-icon">📦</div>
                    <p>Nenhuma compra em andamento</p>
                  </div>
                ) : (
                  <div className="compras-cards-grid">
                    {emProcesso.map(solicitacao => (
                      <div key={solicitacao.id} className="compra-card">
                        <div className="compra-card-header">
                          <div className="compra-user-info">
                            <div className="compra-user-name">{solicitacao.solicitanteNome}</div>
                            <div className="compra-user-email">{solicitacao.solicitanteEmail || 'sem email'}</div>
                          </div>
                          <span className="status-badge-processing">
                            <span className="status-icon">⚙️</span>
                            Em Processo
                          </span>
                        </div>
                        <div className="compra-card-body">
                          <div className="compra-info-row">
                            <span className="info-icon">📍</span>
                            <span className="info-label">Rota:</span>
                            <span className="info-value">{solicitacao.origem} → {solicitacao.destino}</span>
                          </div>
                          <div className="compra-info-row">
                            <span className="info-icon">📅</span>
                            <span className="info-label">Data:</span>
                            <span className="info-value">{new Date(solicitacao.dataIda).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Compras Finalizadas */}
            <div className="compras-section">
              <div className="section-header">
                <span className="section-icon">📋</span>
                <h2 className="section-title">Compras Finalizadas ({finalizadas.length})</h2>
              </div>
              <div className="section-content">
                {finalizadas.length === 0 ? (
                  <div className="empty-state-card">
                    <div className="empty-icon">📋</div>
                    <p>Nenhuma compra finalizada</p>
                  </div>
                ) : (
                  <div className="compras-cards-grid">
                    {finalizadas.map(solicitacao => (
                      <div key={solicitacao.id} className="compra-card compra-card-finished">
                        <div className="compra-card-header">
                          <div className="compra-user-info">
                            <div className="compra-user-name">{solicitacao.solicitanteNome}</div>
                            <div className="compra-user-email">{solicitacao.solicitanteEmail || 'sem email'}</div>
                          </div>
                          <span className="status-badge-finished">
                            Comprada
                          </span>
                        </div>
                        <div className="compra-card-body">
                          <div className="compra-info-row">
                            <span className="info-icon">📍</span>
                            <span className="info-label">Rota:</span>
                            <span className="info-value">{solicitacao.origem} → {solicitacao.destino}</span>
                          </div>
                          <div className="compra-info-row">
                            <span className="info-icon">📅</span>
                            <span className="info-label">Data:</span>
                            <span className="info-value">{new Date(solicitacao.dataIda).toLocaleDateString('pt-BR')}</span>
                          </div>
                          <div className="compra-info-row highlight-row">
                            <span className="info-icon">💰</span>
                            <span className="info-label">Valor Estimado:</span>
                            <span className="info-value price-value">
                              R$ {getPreco(solicitacao).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                          {solicitacao.processamentoCompras?.bilhete && (
                            <div className="compra-info-row highlight-row ticket-row">
                              <span className="info-icon">🎫</span>
                              <span className="info-label">Bilhete:</span>
                              <span className="info-value ticket-value">
                                {solicitacao.processamentoCompras.bilhete}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                Processar Compra - {selectedSolicitacao && (
                  <>
                    {selectedSolicitacao.origem} → {selectedSolicitacao.destino}
                  </>
                )}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label className="form-label">Número do Bilhete *</label>
              <input
                type="text"
                className="form-input"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Informe o número do bilhete..."
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-success"
                onClick={confirmarProcessamento}
                disabled={loading || !observacoes.trim()}
              >
                {loading ? 'Processando...' : 'Confirmar Processamento'}
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

export default Compras
