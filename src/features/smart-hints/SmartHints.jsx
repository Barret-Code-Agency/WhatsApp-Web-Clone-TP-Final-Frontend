
import React from 'react';
import '../../styles/SmartHints.css';

// ── Detectores ──────────────
const EMAIL_RE = /([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-z]{2,})/gi;
const URL_RE = /https?:\/\/[^\s]+/gi;
const DATE_RE = /\b(?:hoy|mañana|el\s+\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?|\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)(?:\s+a\s+las?\s+\d{1,2}(?::\d{2})?(?:\s*hs?\.?)?)?/gi;
const PHONE_RE = /(?:\+?[\d\s\-\(\)]{9,15})/g;
const ATTACH_RE = /(te mando|mando|adjunto|archivo|pdf|documento|el doc|el pdf|el archivo)/i;

export function detectHints(text) {
    const hints = [];

    const emails = [...new Set(text.match(EMAIL_RE) || [])];
    emails.forEach(e => hints.push({ type: 'email', value: e, label: `Copiar email: ${e}` }));

    const urls = [...new Set(text.match(URL_RE) || [])];
    urls.forEach(u => hints.push({ type: 'url', value: u, label: 'Abrir enlace' }));

    const dates = [...new Set(text.match(DATE_RE) || [])];
    dates.forEach(d => hints.push({ type: 'date', value: d, label: `Agendar: "${d}"` }));

    const phones = [...new Set(text.match(PHONE_RE) || [])]
        .map(p => p.trim())
        .filter(p => p.replace(/\D/g, '').length >= 7);
    phones.forEach(p => hints.push({ type: 'phone', value: p, label: `Llamar: ${p}` }));

    if (ATTACH_RE.test(text)) hints.push({ type: 'attach', value: null, label: 'Subir archivo' });

    return hints;
}

// ── Acciones ────────────────
const handleHint = (hint) => {
    switch (hint.type) {
        case 'email':
            navigator.clipboard.writeText(hint.value)
                .then(() => alert(`Email copiado: ${hint.value}`))
                .catch(() => { });
            break;
        case 'url':
            window.open(hint.value, '_blank', 'noopener');
            break;
        case 'phone':
            window.open(`tel:${hint.value.replace(/\s/g, '')}`);
            break;
        case 'date': {
            const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
            const ics = [
                'BEGIN:VCALENDAR',
                'VERSION:2.0',
                'BEGIN:VEVENT',
                'SUMMARY:Reunión / Cita',
                `DESCRIPTION:${hint.value}`,
                `DTSTART:${now}`,
                `DTEND:${now}`,
                'END:VEVENT',
                'END:VCALENDAR',
            ].join('\r\n');
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
            a.download = 'evento.ics';
            a.click();
            URL.revokeObjectURL(a.href);
            break;
        }
        case 'attach': {
            const input = document.createElement('input');
            input.type = 'file';
            input.onchange = (e) => {
                const file = e.target.files?.[0];
                if (file) alert(`Archivo seleccionado: ${file.name}\n(Integración con backend pendiente)`);
            };
            input.click();
            break;
        }
        default: break;
    }
};

const HINT_ICONS = { email: '📧', url: '🔗', date: '📅', phone: '📞', attach: '📎' };

export default function SmartHints({ text }) {
    const hints = detectHints(text);
    if (hints.length === 0) return null;

    return (
        <div className="sh__container">
            {hints.map((h, i) => (
                <button
                    key={i}
                    className="sh__chip"
                    onClick={() => handleHint(h)}
                    title={h.label}
                >
                    <span className="sh__icon">{HINT_ICONS[h.type]}</span>
                    <span className="sh__label">{h.label}</span>
                </button>
            ))}
        </div>
    );
}
