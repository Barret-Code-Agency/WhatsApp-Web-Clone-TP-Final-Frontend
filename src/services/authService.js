import { api, setToken, clearToken } from './api.js'

export const register = ({ email, password, display_name, phone_number, captcha_token }) =>
    api.post('/api/auth/register', { email, password, display_name, phone_number, captcha_token })

export const login = async ({ email, password }) => {
    const data = await api.post('/api/auth/login', { email, password })
    if (data?.access_token) {
        setToken(data.access_token)
    }
    return data // { access_token, user }
}

// Pide el email de recuperación. El backend responde siempre igual (exista o no
// el email); en desarrollo devuelve `reset_url` para poder probar sin casilla.
export const forgotPassword = (email) =>
    api.post('/api/auth/forgot-password', { email })

// Fija la nueva contraseña con el token que llegó por email.
export const resetPassword = ({ token, password }) =>
    api.post('/api/auth/reset-password', { token, password })

export const logout = () => clearToken()
