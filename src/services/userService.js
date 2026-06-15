import { api } from './api.js'

// Actualiza el perfil del usuario en sesion (nombre, estado y/o foto).
export const updateProfile = async (data) => {
    const result = await api.patch('/api/users/me', data)
    return result.user
}
