// Estados y modos de la UI centralizados (sin magic strings)

export const APP_STEP = {
    LOADING: 'loading',
    LANDING: 'landing',
    LOGIN_FORM: 'login-form',
    MAIN: 'main'
}

export const AUTH_MODE = {
    LOGIN: 'login',
    REGISTER: 'register',
    VERIFY: 'verify'
}

export const MESSAGE_STATUS = {
    SENT: 'sent',
    READ: 'read'
}

export const THEME = {
    DARK: 'dark',
    LIGHT: 'light'
}

// Avatar por defecto para usuarios sin foto
export const DEFAULT_AVATAR = '/images/avatar.avif'
