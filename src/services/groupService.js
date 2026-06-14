import { api } from './api.js'

export const listGroups = async () => {
    const data = await api.get('/api/groups')
    return data.groups
}

export const createGroup = async (name, memberIds) => {
    const data = await api.post('/api/groups', { name, member_ids: memberIds })
    return data.group
}

// Devuelve { group, members } con los miembros populados
export const getGroup = async (groupId) => {
    return await api.get(`/api/groups/${groupId}`)
}

export const updateGroup = async (groupId, changes) => {
    const data = await api.put(`/api/groups/${groupId}`, changes)
    return data.group
}

export const deleteGroup = (groupId) => api.delete(`/api/groups/${groupId}`)

export const addGroupMember = (groupId, userId) =>
    api.post(`/api/groups/${groupId}/members`, { user_id: userId })

export const removeGroupMember = (groupId, userId) =>
    api.delete(`/api/groups/${groupId}/members/${userId}`)
