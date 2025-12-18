// Configuração da URL da API
// IMPORTANTE: em produção (Netlify/iframe), NUNCA pode ficar em localhost.
// Use VITE_API_URL apontando para o backend publicado (Render).
// Fallback: usa a própria origem (quando frontend e backend estão no mesmo domínio).
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3001')

export default API_BASE_URL

