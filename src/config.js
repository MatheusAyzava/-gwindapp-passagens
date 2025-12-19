// Configuração da URL da API
// IMPORTANTE: em produção (Netlify/iframe), NUNCA pode ficar em localhost.
// Use VITE_API_URL apontando para o backend publicado (Render).
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD 
    ? 'https://gwindapp-passagens-backend-1.onrender.com' // Backend no Render (ajuste se necessário)
    : 'http://localhost:3001' // Local para desenvolvimento
  )

// Log para debug (remover em produção se necessário)
if (typeof window !== 'undefined') {
  console.log('API_BASE_URL configurada:', API_BASE_URL)
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
  console.log('PROD:', import.meta.env.PROD)
}

export default API_BASE_URL

