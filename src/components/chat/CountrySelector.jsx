import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

const CountrySelector = ({ countries, selected, onChange }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filtered = countries.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.dial.includes(search)
    );

    return (
        <div className="cs__wrapper" ref={dropdownRef}>
            <p className="cs__label">País</p>
            <div className="cs__trigger" onClick={() => setOpen(v => !v)}>
                <span className="cs__value">{selected.code} {selected.dial}</span>
                <span className="cs__arrow">▼</span>
            </div>

            {open && (
                <div className="country-dropdown">
                    <div className="country-search-wrapper">
                        <Search size={14} color="#8696a0" />
                        <input
                            type="text"
                            placeholder="Buscar país..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="country-search-input"
                            autoFocus
                            onClick={e => e.stopPropagation()}
                        />
                    </div>
                    <div className="country-list">
                        {filtered.map(c => (
                            <div
                                key={c.code + c.dial}
                                className={`country-option ${selected.code === c.code ? 'country-option--active' : ''}`}
                                onClick={() => { onChange(c); setOpen(false); setSearch(''); }}
                            >
                                <span className="country-option-name">{c.name}</span>
                                <span className="country-option-dial">{c.dial}</span>
                            </div>
                        ))}
                        {filtered.length === 0 && (
                            <div className="country-no-results">Sin resultados</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CountrySelector;
