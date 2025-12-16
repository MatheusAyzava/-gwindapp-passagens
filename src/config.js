// Configuração da URL da API baseada no ambiente
// Para produção, configure a variável de ambiente VITE_API_URL na Netlify
// Ou publique o backend e atualize a URL abaixo
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'http://localhost:3001' // TODO: Substitua pela URL do seu backend publicado
    : 'http://localhost:3001' // URL local para desenvolvimento
  )

export default API_BASE_URL

