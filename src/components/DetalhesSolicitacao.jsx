import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Sidebar from './Sidebar'
import HeaderUser from './HeaderUser'
import './DetalhesSolicitacao.css'

function DetalhesSolicitacao({ user, onLogout }) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [solicitacao, setSolicitacao] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSolicitacao()
  }, [id])

  const loadSolicitacao = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/solicitacoes/${id}`)
      setSolicitacao(response.data)
    } catch (error) {
      console.error('Erro ao carregar solicitação:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusLabel = (status) => {
    const labels = {
      PENDENTE_COTACAO: 'Pendente Cotação',
      AGUARDANDO_ESCOLHA: 'Aguardando Escolha',
      AGUARDANDO_APROVACAO: 'Aguardando Aprovação',
      PENDENTE_GESTOR: 'Pendente Aprovação do Gestor',
      PENDENTE_GERENTE: 'Pendente Aprovação do Gerente',
      PENDENTE_DIRETOR: 'Pendente Aprovação do Diretor',
      APROVADO_FINAL: 'Aprovado Final',
      EM_COMPRA: 'Em Compra',
      COMPRADA: 'Comprada',
      REJEITADA: 'Rejeitada',
      AJUSTE_SOLICITADO: 'Ajuste Solicitado',
      pendente_gerente: 'Pendente Aprovação do Gerente',
      pendente_diretor: 'Pendente Aprovação do Diretor',
      pendente_compras: 'Pendente Processamento em Compras',
      processada: 'Processada',
      rejeitada: 'Rejeitada'
    }
    return labels[status] || status
  }

  const formatarData = (data) => {
    if (!data) return 'N/A'
    try {
      return new Date(data).toLocaleDateString('pt-BR')
    } catch {
      return data
    }
  }

  const formatarDataHora = (data) => {
    if (!data) return 'N/A'
    try {
      return new Date(data).toLocaleString('pt-BR')
    } catch {
      return data
    }
  }

  if (loading) {
    return (
      <div className="layout">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="main-content">
          <div className="container">
            <div className="page-header">
              <div>
                <h1 className="page-title">Detalhes da Solicitação</h1>
              </div>
              <HeaderUser user={user} onLogout={onLogout} />
            </div>
            <div className="loading">Carregando...</div>
          </div>
        </div>
      </div>
    )
  }

  if (!solicitacao) {
    return (
      <div className="layout">
        <Sidebar user={user} onLogout={onLogout} />
        <div className="main-content">
          <div className="container">
            <div className="page-header">
              <div>
                <h1 className="page-title">Detalhes da Solicitação</h1>
              </div>
              <HeaderUser user={user} onLogout={onLogout} />
            </div>
            <div className="error-message">Solicitação não encontrada</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="layout">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Detalhes da Solicitação</h1>
              <p className="page-subtitle">Informações completas da solicitação de passagem</p>
            </div>
            <HeaderUser user={user} onLogout={onLogout} />
          </div>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Detalhes da Solicitação</h2>
          </div>

          {/* Tipo de Serviço */}
          {solicitacao.tipoServico && (
            <div className="detalhes-section">
              <h3 className="section-title">Tipo de Serviço</h3>
              <div className="detalhe-item">
                <label>Tipo de Serviço</label>
                <div className="detalhe-value">{solicitacao.tipoServico}</div>
              </div>
            </div>
          )}

          {/* Informações Gerais */}
          <div className="detalhes-section">
            <h3 className="section-title">INFORMAÇÕES GERAIS</h3>
            <div className="detalhes-grid">
              <div className="detalhe-item">
                <label>Nome Completo</label>
                <div className="detalhe-value">{solicitacao.nomeCompleto || solicitacao.solicitanteNome}</div>
              </div>

              {solicitacao.empresa && (
                <div className="detalhe-item">
                  <label>Empresa</label>
                  <div className="detalhe-value">{solicitacao.empresa}</div>
                </div>
              )}

              {solicitacao.gestor && (
                <div className="detalhe-item">
                  <label>Gestor</label>
                  <div className="detalhe-value">{solicitacao.gestor}</div>
                </div>
              )}

              {solicitacao.nomeViajantes && (
                <div className="detalhe-item full-width">
                  <label>Nome dos Viajantes</label>
                  <div className="detalhe-value">{solicitacao.nomeViajantes}</div>
                </div>
              )}
            </div>
          </div>

          {/* Informações */}
          {(solicitacao.projeto || solicitacao.motivoViagem || solicitacao.urgencia) && (
            <div className="detalhes-section">
              <h3 className="section-title">INFORMAÇÕES</h3>
              <div className="detalhes-grid">
                {solicitacao.projeto && (
                  <div className="detalhe-item">
                    <label>Projeto</label>
                    <div className="detalhe-value">{solicitacao.projeto}</div>
                  </div>
                )}

                {solicitacao.motivoViagem && (
                  <div className="detalhe-item">
                    <label>Motivo da Viagem</label>
                    <div className="detalhe-value">{solicitacao.motivoViagem}</div>
                  </div>
                )}

                {solicitacao.urgencia && (
                  <div className="detalhe-item">
                    <label>Urgência</label>
                    <div className="detalhe-value">
                      <span className={`badge-urgencia ${solicitacao.urgencia === 'SIM' ? 'urgente' : ''}`}>
                        {solicitacao.urgencia}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Origem e Destino */}
          <div className="detalhes-section">
            <h3 className="section-title">ORIGEM E DESTINO</h3>
            <div className="detalhes-grid">
              {solicitacao.paisOrigem && (
                <div className="detalhe-item">
                  <label>País de Origem</label>
                  <div className="detalhe-value">{solicitacao.paisOrigem}</div>
                </div>
              )}

              {solicitacao.paisDestino && (
                <div className="detalhe-item">
                  <label>País de Destino</label>
                  <div className="detalhe-value">{solicitacao.paisDestino}</div>
                </div>
              )}

              <div className="detalhe-item">
                <label>Cidade de Origem</label>
                <div className="detalhe-value">{solicitacao.cidadeOrigem || solicitacao.origem}</div>
              </div>

              <div className="detalhe-item">
                <label>Cidade de Destino</label>
                <div className="detalhe-value">{solicitacao.cidadeDestino || solicitacao.destino}</div>
              </div>
            </div>
          </div>

          {/* Datas e Prazos */}
          <div className="detalhes-section">
            <h3 className="section-title">DATAS E PRAZOS</h3>
            <div className="detalhes-grid">
              <div className="detalhe-item">
                <label>Data de Partida</label>
                <div className="detalhe-value">
                  {formatarData(solicitacao.dataPartida || solicitacao.dataIda)}
                </div>
              </div>

              {(solicitacao.dataRetorno || solicitacao.dataVolta) && (
                <div className="detalhe-item">
                  <label>Data de Retorno</label>
                  <div className="detalhe-value">
                    {formatarData(solicitacao.dataRetorno || solicitacao.dataVolta)}
                  </div>
                </div>
              )}

              {solicitacao.flexibilidade && (
                <div className="detalhe-item">
                  <label>Flexibilidade</label>
                  <div className="detalhe-value">{solicitacao.flexibilidade}</div>
                </div>
              )}

              {solicitacao.departamento && (
                <div className="detalhe-item">
                  <label>Departamento</label>
                  <div className="detalhe-value">{solicitacao.departamento}</div>
                </div>
              )}
            </div>
          </div>

          {/* Justificativa */}
          {(solicitacao.justificativa || solicitacao.motivoViagem) && (
            <div className="detalhes-section">
              <h3 className="section-title">JUSTIFICATIVA</h3>
              <div className="detalhe-item full-width">
                <div className="detalhe-value">{solicitacao.justificativa || solicitacao.motivoViagem}</div>
              </div>
            </div>
          )}

          {/* Informações do Sistema */}
          <div className="detalhes-section">
            <h3 className="section-title">INFORMAÇÕES DO SISTEMA</h3>
            <div className="detalhes-grid">
              <div className="detalhe-item">
                <label>Solicitante</label>
                <div className="detalhe-value">{solicitacao.solicitanteNome}</div>
              </div>

              <div className="detalhe-item">
                <label>Data de Criação</label>
                <div className="detalhe-value">
                  {formatarDataHora(solicitacao.createdAt)}
                </div>
              </div>

              <div className="detalhe-item">
                <label>Status</label>
                <div className="detalhe-value">
                  <span className={`status-badge status-${solicitacao.status}`}>
                    {getStatusLabel(solicitacao.status)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {solicitacao.vooEscolhido && (
            <div className="voo-escolhido-section">
              <h3>✈️ Voo Escolhido</h3>
              <div className="voo-escolhido-card">
                <div className="voo-escolhido-header">
                  <div className="voo-escolhido-companhia-preco">
                    <span className="voo-escolhido-companhia">{solicitacao.vooEscolhido.companhia}</span>
                    <span className="voo-escolhido-preco">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: solicitacao.vooEscolhido.moeda || 'BRL'
                      }).format(parseFloat(solicitacao.vooEscolhido.preco))}
                    </span>
                  </div>
                </div>
                <div className="voo-escolhido-detalhes">
                  <div className="voo-escolhido-trecho">
                    <div className="voo-escolhido-info">
                      <div className="voo-escolhido-rota">
                        <strong>{solicitacao.vooEscolhido.origem}</strong>
                        <span>→</span>
                        <strong>{solicitacao.vooEscolhido.destino}</strong>
                      </div>
                      <div className="voo-escolhido-horarios">
                        <span>
                          Partida: {new Date(solicitacao.vooEscolhido.dataIda).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {solicitacao.vooEscolhido.detalhes?.ida?.[solicitacao.vooEscolhido.detalhes.ida.length - 1]?.chegada && (
                          <span>
                            Chegada: {new Date(solicitacao.vooEscolhido.detalhes.ida[solicitacao.vooEscolhido.detalhes.ida.length - 1].chegada).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        )}
                      </div>
                      <div className="voo-escolhido-meta">
                        <span>Duração: {solicitacao.vooEscolhido.duracaoIda}</span>
                        {solicitacao.vooEscolhido.escalasIda === 0 ? (
                          <span className="voo-escolhido-direto">Voo Direto</span>
                        ) : (
                          <span className="voo-escolhido-escalas">{solicitacao.vooEscolhido.escalasIda} escala(s)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {solicitacao.vooEscolhido.dataVolta && (
                    <div className="voo-escolhido-trecho volta">
                      <div className="voo-escolhido-info">
                        <div className="voo-escolhido-rota">
                          <strong>{solicitacao.vooEscolhido.destino}</strong>
                          <span>→</span>
                          <strong>{solicitacao.vooEscolhido.origem}</strong>
                        </div>
                        <div className="voo-escolhido-horarios">
                          <span>
                            Partida: {new Date(solicitacao.vooEscolhido.dataVolta).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {solicitacao.vooEscolhido.detalhes?.volta?.[solicitacao.vooEscolhido.detalhes.volta.length - 1]?.chegada && (
                            <span>
                              Chegada: {new Date(solicitacao.vooEscolhido.detalhes.volta[solicitacao.vooEscolhido.detalhes.volta.length - 1].chegada).toLocaleString('pt-BR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          )}
                        </div>
                        <div className="voo-escolhido-meta">
                          <span>Duração: {solicitacao.vooEscolhido.duracaoVolta}</span>
                          {solicitacao.vooEscolhido.escalasVolta === 0 ? (
                            <span className="voo-escolhido-direto">Voo Direto</span>
                          ) : (
                            <span className="voo-escolhido-escalas">{solicitacao.vooEscolhido.escalasVolta} escala(s)</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {solicitacao.vooEscolhido.detalhes?.ida && solicitacao.vooEscolhido.detalhes.ida.length > 0 && (
                    <div className="voo-escolhido-segmentos">
                      <h4>Detalhes do Voo de Ida:</h4>
                      {solicitacao.vooEscolhido.detalhes.ida.map((segmento, idx) => (
                        <div key={idx} className="voo-escolhido-segmento">
                          <div className="segmento-info">
                            <span><strong>{segmento.companhia} {segmento.numeroVoo}</strong></span>
                            <span>{segmento.origem} → {segmento.destino}</span>
                          </div>
                          <div className="segmento-horarios">
                            <span>Partida: {new Date(segmento.partida).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>Chegada: {new Date(segmento.chegada).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>Duração: {segmento.duracao}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {solicitacao.vooEscolhido.detalhes?.volta && solicitacao.vooEscolhido.detalhes.volta.length > 0 && (
                    <div className="voo-escolhido-segmentos">
                      <h4>Detalhes do Voo de Volta:</h4>
                      {solicitacao.vooEscolhido.detalhes.volta.map((segmento, idx) => (
                        <div key={idx} className="voo-escolhido-segmento">
                          <div className="segmento-info">
                            <span><strong>{segmento.companhia} {segmento.numeroVoo}</strong></span>
                            <span>{segmento.origem} → {segmento.destino}</span>
                          </div>
                          <div className="segmento-horarios">
                            <span>Partida: {new Date(segmento.partida).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>Chegada: {new Date(segmento.chegada).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>Duração: {segmento.duracao}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {solicitacao.aprovacaoGerente && (
            <div className="aprovacao-section">
              <h3>Aprovação do Gerente</h3>
              <div className={`aprovacao-box ${solicitacao.aprovacaoGerente.aprovado ? 'aprovado' : 'rejeitado'}`}>
                <div className="aprovacao-status">
                  {solicitacao.aprovacaoGerente.aprovado ? '✓ Aprovado' : '✗ Rejeitado'}
                </div>
                <div className="aprovacao-motivo">{solicitacao.aprovacaoGerente.motivo}</div>
                <div className="aprovacao-data">
                  {new Date(solicitacao.aprovacaoGerente.data).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          )}

          {solicitacao.aprovacaoDiretor && (
            <div className="aprovacao-section">
              <h3>Aprovação do Diretor</h3>
              <div className={`aprovacao-box ${solicitacao.aprovacaoDiretor.aprovado ? 'aprovado' : 'rejeitado'}`}>
                <div className="aprovacao-status">
                  {solicitacao.aprovacaoDiretor.aprovado ? '✓ Aprovado' : '✗ Rejeitado'}
                </div>
                <div className="aprovacao-motivo">{solicitacao.aprovacaoDiretor.motivo}</div>
                <div className="aprovacao-data">
                  {new Date(solicitacao.aprovacaoDiretor.data).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          )}

          {solicitacao.processamentoCompras && (
            <div className="aprovacao-section">
              <h3>Processamento de Compras</h3>
              <div className="aprovacao-box aprovado">
                <div className="aprovacao-status">✓ Processado</div>
                {solicitacao.processamentoCompras.observacoes && (
                  <div className="aprovacao-motivo">{solicitacao.processamentoCompras.observacoes}</div>
                )}
                <div className="aprovacao-data">
                  {new Date(solicitacao.processamentoCompras.data).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>
          )}

          {solicitacao.historico && solicitacao.historico.length > 0 && (
            <div className="historico-section">
              <h3>Histórico</h3>
              <div className="historico-list">
                {solicitacao.historico.map((item, index) => (
                  <div key={index} className="historico-item">
                    <div className="historico-acao">{item.acao}</div>
                    {item.motivo && <div className="historico-motivo">{item.motivo}</div>}
                    <div className="historico-data">
                      {new Date(item.data).toLocaleString('pt-BR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/dashboard')}
            >
              Voltar
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default DetalhesSolicitacao

