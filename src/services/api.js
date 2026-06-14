import ENVIRONMENT from '../config/environment.js'
import { STORAGE_KEYS } from '../constants/storage.js'

const TOKEN_KEY = STORAGE_KEYS.TOKEN

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(TOKEN_KEY)

// Hace la llamada al backend: agrega el token si existe y LANZA si la respuesta
// no es ok (fetch no tira solo en 4xx/5xx). Devuelve directamente el data de la API.
const request = async (method, path, body) => {
    const headers = { 'Content-Type': 'application/json' }
    const token = getToken()
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(ENVIRONMENT.API_URL + path, {
        method,
        headers,
        ...(body ? { body: JSON.stringify(body) } : {})
    })

    let payload = null
    try {
        payload = await response.json()
    } catch {
        payload = null
    }

    if (!response.ok || !payload || payload.ok === false) {
        const error = new Error(payload?.message || 'Ocurrio un error en la solicitud')
        error.status = payload?.status || response.status
        throw error
    }

    return payload.data
}

export const api = {
    get: (path) => request('GET', path),
    post: (path, body) => request('POST', path, body),
    put: (path, body) => request('PUT', path, body),
    delete: (path) => request('DELETE', path)
}
