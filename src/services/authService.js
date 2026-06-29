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

export const logout = () => clearToken()
