import React, { useState } from 'react';
import { UserRound } from 'lucide-react';
import CountrySelector from './CountrySelector';
import { COUNTRIES } from '../../data/countries';
import '../../styles/AddContactPanel.css';

const AddContactPanel = ({ onClose }) => {
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [syncOn, setSyncOn] = useState(false);

    return (
        <section className="add-panel animate-slide-in">

            {/* Header */}
            <div className="add-panel__header">
                <button className="add-panel__close" onClick={onClose}>✕</button>
                <h2 className="add-panel__title">Nuevo contacto</h2>
            </div>

            {/* Avatar */}
            <div className="add-panel__avatar">
                <div className="add-panel__avatar-circle">
                    <UserRound size={40} />
                </div>
            </div>

            {/* Formulario */}
            <div className="add-panel__form">

                <div className="add-panel__field">
                    <span className="add-panel__icon">👤</span>
                    <div className="add-panel__input-wrapper">
                        <input type="text" placeholder="Nombre" className="add-panel__input" />
                    </div>
                </div>

                <div className="add-panel__field add-panel__field--indented">
                    <div className="add-panel__input-wrapper">
                        <input type="text" placeholder="Apellido" className="add-panel__input" />
                    </div>
                </div>

                <div className="add-panel__field add-panel__field--phone">
                    <span className="add-panel__icon">📞</span>
                    <div className="add-panel__phone-row">
                        <CountrySelector
                            countries={COUNTRIES}
                            selected={selectedCountry}
                            onChange={setSelectedCountry}
                        />
                        <div className="add-panel__phone-number">
                            <span className="add-panel__phone-label">Teléfono</span>
                            <input
                                type="text"
                                className="add-panel__phone-input"
                                placeholder="Número"
                            />
                        </div>
                    </div>
                </div>

                <div className="add-panel__sync">
                    <span className="add-panel__sync-icon">🔄</span>
                    <div className="add-panel__sync-content">
                        <p className="add-panel__sync-title">Sincronizar contacto con el teléfono</p>
                        <p className="add-panel__sync-desc">
                            Se añadirá este contacto a la libreta de contactos de tu teléfono.
                        </p>
                    </div>
                    <div
                        className={`add-panel__toggle ${syncOn ? 'add-panel__toggle--on' : ''}`}
                        onClick={() => setSyncOn(v => !v)}
                    >
                        <div className="add-panel__toggle-circle" />
                    </div>
                </div>

            </div>

            {/* Footer */}
            <div className="add-panel__footer">
                <button className="add-panel__save-btn">GUARDAR</button>
            </div>

        </section>
    );
};

export default AddContactPanel;
