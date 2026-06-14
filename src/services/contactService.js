import { api } from './api.js'

// Busca usuarios por nombre o email para agregarlos como contacto.
export const searchUsers = async (query) => {
    const data = await api.get(`/api/users?q=${encodeURIComponent(query)}`)
    return data.users
}

export const listContacts = async () => {
    const data = await api.get('/api/contacts')
    return data.contacts
}

export const addContact = async (contact_user_id, alias) => {
    const data = await api.post('/api/contacts', { contact_user_id, alias })
    return data.contact
}

export const updateContact = async (contact_id, changes) => {
    const data = await api.put(`/api/contacts/${contact_id}`, changes)
    return data.contact
}

export const removeContact = (contact_id) => api.delete(`/api/contacts/${contact_id}`)
