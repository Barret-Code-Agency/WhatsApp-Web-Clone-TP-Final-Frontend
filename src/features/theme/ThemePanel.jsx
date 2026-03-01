import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useTheme, PRESETS } from '../../context/ThemeContext';
import '../../styles/ThemePanel.css';

const CUSTOMIZABLE = [
    { var: '--wa-bg-chat', label: 'Fondo chat' },
    { var: '--wa-bg-bubble-me', label: 'Mis burbujas' },
    { var: '--wa-bg-bubble-them', label: 'Sus burbujas' },
    { var: '--wa-green', label: 'Color acento' },
    { var: '--wa-text-primary', label: 'Texto principal' },
    { var: '--wa-bg-panel', label: 'Paneles' },
];

function rgbToHex(str) {
    if (!str || str.startsWith('#')) return str || '#000000';
    const match = str.match(/\d+/g);
    if (!match || match.length < 3) return '#000000';
    return '#' + match.slice(0, 3)
        .map(n => parseInt(n).toString(16).padStart(2, '0'))
        .join('');
}

const ThemePanel = () => {
    const { themeName, setTheme, customColors, setCustomColor } = useTheme();
    const [open, setOpen] = useState(false);

    const modal = open && ReactDOM.createPortal(
        <div className="tp__overlay" onClick={() => setOpen(false)}>
            <div className="tp__panel" onClick={e => e.stopPropagation()}>
                <div className="tp__header">
                    <h2 className="tp__title">Temas y apariencia</h2>
                    <button className="tp__close" onClick={() => setOpen(false)}>✕</button>
                </div>

                <div className="tp__section">
                    <p className="tp__section-label">Presets</p>
                    <div className="tp__presets">
                        {Object.entries(PRESETS).map(([key, preset]) => (
                            <button
                                key={key}
                                className={`tp__preset ${themeName === key ? 'tp__preset--active' : ''}`}
                                onClick={() => setTheme(key)}
                            >
                                <div
                                    className="tp__preset-swatch"
                                    style={{ backgroundColor: preset['--wa-bg-chat'] }}
                                />
                                <span>{preset.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="tp__section">
                    <p className="tp__section-label">Personalizar</p>
                    <div className="tp__customs">
                        {CUSTOMIZABLE.map(item => {
                            const raw = customColors[item.var]
                                || getComputedStyle(document.documentElement).getPropertyValue(item.var).trim()
                                || '#000000';
                            const current = rgbToHex(raw);
                            return (
                                <div key={item.var} className="tp__custom-item">
                                    <label className="tp__custom-label">{item.label}</label>
                                    <input
                                        type="color"
                                        className="tp__color-input"
                                        value={current}
                                        onChange={e => setCustomColor(item.var, e.target.value)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button className="tp__reset" onClick={() => setTheme(themeName)}>
                    Restaurar preset actual
                </button>
            </div>
        </div>,
        document.body
    );

    return (
        <>
            <span
                onClick={e => { e.stopPropagation(); setOpen(true); }}
                style={{ cursor: 'pointer', width: '100%', display: 'block' }}
            >
                Temas y apariencia
            </span>
            {modal}
        </>
    );
};

export default ThemePanel;
