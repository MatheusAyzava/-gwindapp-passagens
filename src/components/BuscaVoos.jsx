import { useState } from 'react'
import axios from 'axios'
import API_BASE_URL from '../config'
import './BuscaVoos.css'

function BuscaVoos({ origem, destino, dataIda, dataVolta, onVooSelecionado, vooSelecionado }) {
  const [voos, setVoos] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [erro, setErro] = useState('')
  const [mostrarResultados, setMostrarResultados] = useState(false)
  const [confirmandoPrecos, setConfirmandoPrecos] = useState(false)
  const [precosConfirmados, setPrecosConfirmados] = useState({})

  const confirmarPrecoVoo = async (voo) => {
    // Se o voo não tem o objeto original da oferta, não pode confirmar
    if (!voo._originalOffer) {
      return null;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/voos/confirmar-preco`, {
        flightOffer: voo._originalOffer
      });
      
      return response.data;
    } catch (error) {
      console.error('Erro ao confirmar preço:', error);
      return null;
    }
  }

  const confirmarPrecosVoos = async (listaVoos) => {
    setConfirmandoPrecos(true);
    const precos = {};
    
    // Confirmar preços dos primeiros 5 voos (para não sobrecarregar a API)
    const voosParaConfirmar = listaVoos.slice(0, 5);
    
    for (const voo of voosParaConfirmar) {
      if (voo._originalOffer) {
        const precoConfirmado = await confirmarPrecoVoo(voo);
        if (precoConfirmado) {
          precos[voo.id] = precoConfirmado;
        }
      }
    }
    
    setPrecosConfirmados(precos);
    setConfirmandoPrecos(false);
  }

  const buscarVoos = async () => {
    if (!origem || !destino || !dataIda) {
      setErro('Preencha origem, destino e data de ida para buscar voos')
      return
    }

    setBuscando(true)
    setErro('')
    setMostrarResultados(false)

    try {
      const params = new URLSearchParams({
        origem,
        destino,
        dataIda
      })
      
      if (dataVolta) {
        params.append('dataVolta', dataVolta)
      }

      const response = await axios.get(`${API_BASE_URL}/api/voos/buscar?${params}`)
      setVoos(response.data)
      setMostrarResultados(true)
      
      if (response.data.length === 0) {
        setErro('Nenhum voo encontrado para os critérios informados')
      } else {
        // Confirmar preços automaticamente após buscar voos
        confirmarPrecosVoos(response.data);
      }
    } catch (err) {
      setErro(err.response?.data?.message || 'Erro ao buscar voos. Tente novamente.')
      setVoos([])
    } finally {
      setBuscando(false)
    }
  }

  const formatarData = (dataISO) => {
    if (!dataISO) return ''
    const data = new Date(dataISO)
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatarPreco = (preco, moeda) => {
    const valor = parseFloat(preco)
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda || 'BRL'
    }).format(valor)
  }

  const handleSelecionarVoo = (voo) => {
    onVooSelecionado(voo)
    setMostrarResultados(false)
  }

  return (
    <div className="busca-voos-container">
      <div className="busca-voos-header">
        <h3>Buscar e Selecionar Voo</h3>
        <button
          type="button"
          className="btn btn-primary btn-buscar"
          onClick={buscarVoos}
          disabled={buscando || !origem || !destino || !dataIda}
        >
          {buscando ? 'Buscando...' : '🔍 Buscar Voos'}
        </button>
      </div>

      {erro && <div className="error-message">{erro}</div>}

      {vooSelecionado && (
        <div className="voo-selecionado-card">
          <div className="voo-selecionado-header">
            <span className="voo-selecionado-badge">✓ Voo Selecionado</span>
            <button
              type="button"
              className="btn-remover-voo"
              onClick={() => onVooSelecionado(null)}
            >
              ✕ Remover
            </button>
          </div>
          <div className="voo-selecionado-info">
            <div className="voo-info-row">
              <strong>{vooSelecionado.companhia}</strong>
              <span className="voo-preco">{formatarPreco(vooSelecionado.preco, vooSelecionado.moeda)}</span>
            </div>
            <div className="voo-info-row">
              <span>{vooSelecionado.origem} → {vooSelecionado.destino}</span>
              <span>Duração: {vooSelecionado.duracaoIda}</span>
            </div>
            <div className="voo-info-row">
              <span>Partida: {formatarData(vooSelecionado.dataIda)}</span>
              {vooSelecionado.escalasIda > 0 && (
                <span className="voo-escalas">{vooSelecionado.escalasIda} escala(s)</span>
              )}
              {vooSelecionado.escalasIda === 0 && (
                <span className="voo-direto">Voo direto</span>
              )}
            </div>
            {vooSelecionado.dataVolta && (
              <div className="voo-info-row">
                <span>Volta: {formatarData(vooSelecionado.dataVolta)}</span>
                <span>Duração: {vooSelecionado.duracaoVolta}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {mostrarResultados && voos.length > 0 && (
        <div className="voos-resultados">
          <div className="voos-resultados-header">
            <h4>Voos Disponíveis ({voos.length})</h4>
            <button
              type="button"
              className="btn-fechar-resultados"
              onClick={() => setMostrarResultados(false)}
            >
              ✕
            </button>
          </div>
          <div className="voos-lista">
            {voos.map((voo) => (
              <div
                key={voo.id}
                className={`voo-card ${vooSelecionado?.id === voo.id ? 'selecionado' : ''}`}
                onClick={() => handleSelecionarVoo(voo)}
              >
                <div className="voo-card-header">
                  <div className="voo-companhia-preco">
                    <span className="voo-companhia">{voo.companhia}</span>
                    <div className="voo-preco-container">
                      {precosConfirmados[voo.id] ? (
                        <>
                          <span className="voo-preco-card confirmado">
                            {formatarPreco(precosConfirmados[voo.id].preco || precosConfirmados[voo.id].grandTotal, precosConfirmados[voo.id].moeda || voo.moeda)}
                          </span>
                          <span className="voo-preco-badge">✓ Preço Confirmado</span>
                        </>
                      ) : confirmandoPrecos && voos.indexOf(voo) < 5 ? (
                        <>
                          <span className="voo-preco-card">{formatarPreco(voo.preco, voo.moeda)}</span>
                          <span className="voo-preco-badge confirmando">Confirmando...</span>
                        </>
                      ) : (
                        <>
                          <span className="voo-preco-card">{formatarPreco(voo.preco, voo.moeda)}</span>
                          <span className="voo-preco-badge estimado">Preço Estimado</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="voo-card-body">
                  <div className="voo-rota">
                    <div className="voo-trecho">
                      <div className="voo-horario-origem">
                        <span className="voo-hora">{formatarData(voo.dataIda).split(' ')[1]}</span>
                        <span className="voo-aeroporto">
                          {voo.detalhes?.ida?.[0]?.origem || voo.origem}
                        </span>
                      </div>
                      <div className="voo-duracao-escalas">
                        <div className="voo-linha-tempo">
                          <span className="voo-duracao">{voo.duracaoIda}</span>
                        </div>
                        {voo.escalasIda > 0 ? (
                          <span className="voo-escalas-badge">{voo.escalasIda} escala(s)</span>
                        ) : (
                          <span className="voo-direto-badge">Direto</span>
                        )}
                      </div>
                      <div className="voo-horario-destino">
                        <span className="voo-hora">
                          {voo.detalhes?.ida?.[voo.detalhes.ida.length - 1]?.chegada 
                            ? formatarData(voo.detalhes.ida[voo.detalhes.ida.length - 1].chegada).split(' ')[1]
                            : '--:--'}
                        </span>
                        <span className="voo-aeroporto">
                          {voo.detalhes?.ida?.[voo.detalhes.ida.length - 1]?.destino || voo.destino}
                        </span>
                      </div>
                    </div>
                    {voo.dataVolta && (
                      <div className="voo-trecho volta">
                        <div className="voo-horario-origem">
                          <span className="voo-hora">
                            {voo.detalhes?.volta?.[0]?.partida
                              ? formatarData(voo.detalhes.volta[0].partida).split(' ')[1]
                              : formatarData(voo.dataVolta).split(' ')[1]}
                          </span>
                          <span className="voo-aeroporto">
                            {voo.detalhes?.volta?.[0]?.origem || voo.destino}
                          </span>
                        </div>
                        <div className="voo-duracao-escalas">
                          <div className="voo-linha-tempo">
                            <span className="voo-duracao">{voo.duracaoVolta}</span>
                          </div>
                          {voo.escalasVolta > 0 ? (
                            <span className="voo-escalas-badge">{voo.escalasVolta} escala(s)</span>
                          ) : (
                            <span className="voo-direto-badge">Direto</span>
                          )}
                        </div>
                        <div className="voo-horario-destino">
                          <span className="voo-hora">
                            {voo.detalhes?.volta?.[voo.detalhes.volta.length - 1]?.chegada 
                              ? formatarData(voo.detalhes.volta[voo.detalhes.volta.length - 1].chegada).split(' ')[1]
                              : '--:--'}
                          </span>
                          <span className="voo-aeroporto">
                            {voo.detalhes?.volta?.[voo.detalhes.volta.length - 1]?.destino || voo.origem}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="voo-card-footer">
                  <button
                    type="button"
                    className="btn btn-primary btn-selecionar-voo"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelecionarVoo(voo)
                    }}
                  >
                    {vooSelecionado?.id === voo.id ? '✓ Selecionado' : 'Selecionar Voo'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BuscaVoos





