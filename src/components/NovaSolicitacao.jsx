import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../config'
import Sidebar from './Sidebar'
import HeaderUser from './HeaderUser'
import './NovaSolicitacao.css'

function NovaSolicitacao({ user, onLogout }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    // Tipo de serviço
    tipoServico: 'Passagem aérea',
    
    // Informações Gerais
    nomeCompleto: user.name || '',
    empresa: '',
    gestor: '',
    nomeViajantes: '',
    
    // Informações
    projeto: '',
    motivoViagem: '',
    urgencia: 'NÃO',
    
    // Origem e Destino
    paisOrigem: '',
    paisDestino: '',
    cidadeOrigem: '',
    cidadeDestino: '',
    
    // Datas e Prazos
    dataPartida: '',
    dataRetorno: '',
    flexibilidade: '',
    departamento: '',
    
    // Dados do sistema
    solicitanteId: user.id,
    solicitanteNome: user.name,
    solicitanteEmail: user.email
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Opções para dropdowns
  const empresas = ['GWIND', 'BIO ENERGIA', 'TECHWIND RECIFE', 'TECHWIND EUA', 'TECHWIND SERVICES']
  const gestores = [
    'Andre da Hora', 'Anderson Delano', 'Bruno Bellote', 'Carlos Vasconcelos',
    'Célio Ayres', 'Eder Faria', 'Fábio Morais', 'Lucas Santos', 'Lucio Oliveira',
    'Rafael Zamuner', 'Rodrigo Brunoski', 'Maurício Leão'
  ]
  const departamentos = [
    'Operações', 'Engenharia', 'SGI', 'EHS', 'Compras', 'RH', 'Financeiro',
    'Diretoria', 'Comercial', 'Mobilidade'
  ]
  const flexibilidades = [
    'Sem Flexibilidade de alteração',
    'Até 1 dia da data escolhida',
    'Até 3 dias da data escolhida',
    'Até 5 dias da data escolhida',
    'Acima de 5 dias da data escolhida'
  ]

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'radio' ? value : type === 'checkbox' ? checked : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Mapear campos novos para formato antigo (compatibilidade)
      const solicitacaoData = {
        ...formData,
        origem: formData.cidadeOrigem || formData.origem,
        destino: formData.cidadeDestino || formData.destino,
        dataIda: formData.dataPartida || formData.dataIda,
        dataVolta: formData.dataRetorno || formData.dataVolta,
        justificativa: formData.motivoViagem || formData.justificativa
      }
      
      console.log('Enviando solicitação para:', `${API_BASE_URL}/api/solicitacoes`)
      console.log('Dados da solicitação:', solicitacaoData)
      
      const response = await axios.post(`${API_BASE_URL}/api/solicitacoes`, solicitacaoData, {
        timeout: 60000, // 60 segundos para mobile/conexões lentas
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      console.log('Resposta do servidor:', response.data)
      
      // Após criar, já vai para a tela de pendências de aprovação
      navigate('/aprovacoes')
    } catch (err) {
      console.error('Erro completo:', err)
      console.error('Erro response:', err.response)
      console.error('Erro message:', err.message)
      console.error('Erro code:', err.code)
      
      let errorMessage = 'Erro ao criar solicitação. Tente novamente.'
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = 'Timeout: O servidor demorou muito para responder. Verifique sua conexão e tente novamente.'
      } else if (err.code === 'ERR_NETWORK' || err.message?.includes('Network')) {
        errorMessage = 'Erro de rede: Não foi possível conectar ao servidor. Verifique sua conexão com a internet.'
      } else if (err.response) {
        errorMessage = `Erro do servidor: ${err.response.data?.message || err.response.statusText || 'Erro desconhecido'}`
      } else if (err.message) {
        errorMessage = `Erro: ${err.message}`
      }
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <div>
              <h1 className="page-title">Nova Solicitação de Passagem</h1>
              <p className="page-subtitle">Preencha os dados da sua solicitação</p>
            </div>
            <HeaderUser user={user} onLogout={onLogout} />
          </div>
        <div className="card">

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Tipo de Serviço */}
            <div className="form-section">
              <h3 className="section-title">Tipo de Serviço</h3>
              <div className="radio-group">
                {['Aluguel de veículo', 'Passagem aérea', 'Hotel', 'Passagem rodoviária', 'Bagagem Extra'].map(tipo => (
                  <label key={tipo} className="radio-option">
                    <input
                      type="radio"
                      name="tipoServico"
                      value={tipo}
                      checked={formData.tipoServico === tipo}
                      onChange={handleChange}
                    />
                    <span>{tipo}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Informações Gerais */}
            <div className="form-section">
              <h3 className="section-title">INFORMAÇÕES GERAIS</h3>
              
              <div className="form-group">
                <label className="form-label">Digite seu nome completo (SEM ABREVIAÇÕES) *</label>
                <input
                  type="text"
                  name="nomeCompleto"
                  className="form-input"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  required
                  placeholder="Nome completo"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qual a Empresa *</label>
                <div className="radio-group">
                  {empresas.map(empresa => (
                    <label key={empresa} className="radio-option">
                      <input
                        type="radio"
                        name="empresa"
                        value={empresa}
                        checked={formData.empresa === empresa}
                        onChange={handleChange}
                        required
                      />
                      <span>{empresa}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nome do Gestor *</label>
                <div className="radio-group">
                  {gestores.map(gestor => (
                    <label key={gestor} className="radio-option">
                      <input
                        type="radio"
                        name="gestor"
                        value={gestor}
                        checked={formData.gestor === gestor}
                        onChange={handleChange}
                        required
                      />
                      <span>{gestor}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nome completo dos viajantes (SEM ABREVIAÇÕES) *</label>
                <p className="form-hint">Em caso de solicitação para outra pessoa, coloque o nome da mesma que irá fazer a viagem</p>
                <input
                  type="text"
                  name="nomeViajantes"
                  className="form-input"
                  value={formData.nomeViajantes}
                  onChange={handleChange}
                  required
                  placeholder="Nome completo do(s) viajante(s)"
                />
              </div>
            </div>

            {/* Informações */}
            <div className="form-section">
              <h3 className="section-title">INFORMAÇÕES</h3>
              
              <div className="form-group">
                <label className="form-label">Projeto *</label>
                <select
                  name="projeto"
                  className="form-input"
                  value={formData.projeto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o projeto</option>
                  <option value="Projeto A">Projeto A</option>
                  <option value="Projeto B">Projeto B</option>
                  <option value="Projeto C">Projeto C</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Motivo da viagem *</label>
                <select
                  name="motivoViagem"
                  className="form-input"
                  value={formData.motivoViagem}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o motivo</option>
                  <option value="Reunião">Reunião</option>
                  <option value="Visita técnica">Visita técnica</option>
                  <option value="Treinamento">Treinamento</option>
                  <option value="Evento">Evento</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Urgência *</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="urgencia"
                      value="SIM"
                      checked={formData.urgencia === 'SIM'}
                      onChange={handleChange}
                      required
                    />
                    <span>SIM</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="urgencia"
                      value="NÃO"
                      checked={formData.urgencia === 'NÃO'}
                      onChange={handleChange}
                      required
                    />
                    <span>NÃO</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Origem e Destino */}
            <div className="form-section">
              <h3 className="section-title">ORIGEM E DESTINO</h3>
              
              <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">País de Origem *</label>
                <select
                  name="paisOrigem"
                  className="form-input"
                  value={formData.paisOrigem}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione o País de Origem</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Chile">Chile</option>
                  <option value="México">México</option>
                  <option value="Colômbia">Colômbia</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Peru">Peru</option>
                  <option value="Equador">Equador</option>
                  <option value="Uruguai">Uruguai</option>
                  <option value="Paraguai">Paraguai</option>
                  <option value="Bolívia">Bolívia</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Panamá">Panamá</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Espanha">Espanha</option>
                  <option value="França">França</option>
                  <option value="Alemanha">Alemanha</option>
                  <option value="Reino Unido">Reino Unido</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">País de destino *</label>
                <select
                  name="paisDestino"
                  className="form-input"
                  value={formData.paisDestino}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecione País de destino</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Chile">Chile</option>
                  <option value="México">México</option>
                  <option value="Colômbia">Colômbia</option>
                  <option value="Estados Unidos">Estados Unidos</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Peru">Peru</option>
                  <option value="Equador">Equador</option>
                  <option value="Uruguai">Uruguai</option>
                  <option value="Paraguai">Paraguai</option>
                  <option value="Bolívia">Bolívia</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Panamá">Panamá</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Espanha">Espanha</option>
                  <option value="França">França</option>
                  <option value="Alemanha">Alemanha</option>
                  <option value="Reino Unido">Reino Unido</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Cidade de Origem *</label>
                  <input
                    type="text"
                    name="cidadeOrigem"
                    className="form-input"
                    value={formData.cidadeOrigem}
                    onChange={handleChange}
                    required
                    placeholder="Ex: São Paulo"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cidade de Destino *</label>
                  <input
                    type="text"
                    name="cidadeDestino"
                    className="form-input"
                    value={formData.cidadeDestino}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Rio de Janeiro"
                  />
                </div>
              </div>
            </div>

            {/* Datas e Prazos */}
            <div className="form-section">
              <h3 className="section-title">DATAS E PRAZOS</h3>
              
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Data de Partida *</label>
                  <p className="form-hint">Data da viagem</p>
                  <input
                    type="date"
                    name="dataPartida"
                    className="form-input"
                    value={formData.dataPartida}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Retorno (Se aplicável)</label>
                  <input
                    type="date"
                    name="dataRetorno"
                    className="form-input"
                    value={formData.dataRetorno}
                    onChange={handleChange}
                    min={formData.dataPartida || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Flexibilidade de alteração da data de partida *</label>
                <div className="radio-group">
                  {flexibilidades.map(flex => (
                    <label key={flex} className="radio-option">
                      <input
                        type="radio"
                        name="flexibilidade"
                        value={flex}
                        checked={formData.flexibilidade === flex}
                        onChange={handleChange}
                        required
                      />
                      <span>{flex}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Departamento do viajante *</label>
                <div className="radio-group">
                  {departamentos.map(dept => (
                    <label key={dept} className="radio-option">
                      <input
                        type="radio"
                        name="departamento"
                        value={dept}
                        checked={formData.departamento === dept}
                        onChange={handleChange}
                        required
                      />
                      <span>{dept}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Solicitação'}
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  )
}

export default NovaSolicitacao

