import { api } from './api.js'

export const listConversations = async () => {
    const data = await api.get('/api/conversations')
    return data.conversations
}

// Abre (o recupera) el chat privado con un usuario. Devuelve la conversacion.
export const openPrivateConversation = async (userId) => {
    const data = await api.post('/api/conversations/private', { user_id: userId })
    return data.conversation
}

export const getMessages = async (conversationId) => {
    const data = await api.get(`/api/conversations/${conversationId}/messages`)
    return data.messages
}

export const sendMessage = async (conversationId, content) => {
    const data = await api.post(`/api/conversations/${conversationId}/messages`, { content })
    return data.message
}

// Pide al backend que el crack responda mi mensaje: la IA corre en el servidor
// (la API key nunca llega al navegador) y devuelve el mensaje del bot ya persistido.
export const sendBotReply = async (conversationId, content) => {
    const data = await api.post(`/api/conversations/${conversationId}/bot-reply`, { content })
    return data.message
}
