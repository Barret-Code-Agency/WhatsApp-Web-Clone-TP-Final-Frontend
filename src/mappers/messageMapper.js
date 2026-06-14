// Capa de adaptadores: convierte un mensaje del backend a la forma que
// consumen los componentes del chat. `mine` marca si el mensaje es del
// usuario logueado (comparando el emisor con su id), en vez de adivinar por nombre.
const formatTime = (date) =>
    new Date(date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })

export const mapMessage = (message, currentUserId) => {
    const sender = message.sender_user_id || {}
    return {
        id: message._id,
        text: message.content,
        author: sender.display_name || '',
        mine: String(sender._id) === String(currentUserId),
        time: formatTime(message.sent_at),
        status: 'read'
    }
}
