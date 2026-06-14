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

// Persiste la respuesta IA de un crack (el backend la guarda con el bot como emisor)
export const sendBotReply = async (conversationId, content) => {
    const data = await api.post(`/api/conversations/${conversationId}/bot-reply`, { content })
    return data.message
}
