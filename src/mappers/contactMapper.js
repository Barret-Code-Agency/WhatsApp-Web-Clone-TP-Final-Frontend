// Capa de adaptadores: convierte un contacto del backend a la forma que
// consumen los componentes del front. Si la API cambia un campo, se toca
// solo este mapper, no los componentes.
export const mapContact = (contact) => {
    const user = contact.contact_user_id || {}
    return {
        contact_id: contact._id,
        id_usuario: user._id,
        user_id: user._id,
        name: contact.alias || user.display_name || 'Sin nombre',
        evatar_url: user.avatar_url,
        estado_bio: user.status_message || '',
        conection: user.es_bot ? 'En línea' : 'Disponible',
        es_bot: !!user.es_bot,
        email: user.email,
        is_favorite: contact.is_favorite,
        is_blocked: contact.is_blocked
    }
}
