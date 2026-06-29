import { useEffect, useRef } from 'react';
import ENVIRONMENT from '../config/environment.js';

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

// Carga el script de Turnstile una sola vez y reutiliza la promesa.
let scriptPromise = null;
const loadTurnstileScript = () => {
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise((resolve, reject) => {
        if (window.turnstile) return resolve();
        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('No se pudo cargar Turnstile'));
        document.head.appendChild(script);
    });
    return scriptPromise;
};

// Renderiza el CAPTCHA de Cloudflare Turnstile. Si no hay site key configurada,
// no renderiza nada (captcha desactivado) para no romper el flujo.
const TurnstileWidget = ({ onVerify }) => {
    const containerRef = useRef(null);
    const widgetIdRef = useRef(null);

    useEffect(() => {
        if (!ENVIRONMENT.TURNSTILE_SITE_KEY) return;
        let cancelled = false;

        loadTurnstileScript()
            .then(() => {
                if (cancelled || !containerRef.current || !window.turnstile) return;
                widgetIdRef.current = window.turnstile.render(containerRef.current, {
                    sitekey: ENVIRONMENT.TURNSTILE_SITE_KEY,
                    theme: 'auto',
                    callback: (token) => onVerify(token),
                    'expired-callback': () => onVerify(''),
                    'error-callback': () => onVerify('')
                });
            })
            .catch(() => { /* si el script falla, el back rechaza por falta de token */ });

        return () => {
            cancelled = true;
            if (widgetIdRef.current && window.turnstile) {
                try { window.turnstile.remove(widgetIdRef.current); } catch { /* noop */ }
                widgetIdRef.current = null;
            }
        };
    }, [onVerify]);

    if (!ENVIRONMENT.TURNSTILE_SITE_KEY) return null;
    return <div ref={containerRef} className="login-turnstile" />;
};

export default TurnstileWidget;
