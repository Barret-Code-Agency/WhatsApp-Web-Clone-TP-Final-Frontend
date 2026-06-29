import React, { useState } from 'react';
import { UserRound, Search } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import '../../styles/AddContactPanel.css';

const AddContactPanel = ({ onClose }) => {
    const { searchUsers, addContact } = useChat();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [addedIds, setAddedIds] = useState([]);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (query.trim().length < 2) return;
        setError('');
        setLoading(true);
        setSearched(true);
        try {
            const users = await searchUsers(query.trim());
            setResults(users);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (user) => {
        setError('');
        try {
            await addContact(user.id);
            setAddedIds(prev => [...prev, user.id]);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <section className="add-panel animate-slide-in">

            {/* Header */}
            <div className="add-panel__header">
                <button className="add-panel__close" onClick={onClose}>✕</button>
                <h2 className="add-panel__title">Nuevo contacto</h2>
            </div>

            {/* Buscador */}
            <form className="add-panel__form" onSubmit={handleSearch}>
                <div className="add-panel__field">
                    <span className="add-panel__icon"><Search size={18} /></span>
                    <div className="add-panel__input-wrapper">
                        <input
                            type="text"
                            placeholder="Buscar por nombre o email"
                            className="add-panel__input"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="add-panel__save-btn"
                    disabled={loading || query.trim().length < 2}
                >
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {error && <p className="add-panel__error">{error}</p>}

            {/* Resultados */}
            <div className="add-panel__results">
                {searched && !loading && !error && results.length === 0 && (
                    <p className="add-panel__empty">No se encontraron usuarios.</p>
                )}

                {results.map(user => {
                    const added = addedIds.includes(user.id);
                    return (
                        <div key={user.id} className="add-panel__result">
                            <div className="add-panel__result-avatar">
                                {user.avatar_url
                                    ? <img src={user.avatar_url} alt={user.display_name} />
                                    : <UserRound size={22} />}
                            </div>
                            <div className="add-panel__result-info">
                                <div className="add-panel__result-name">{user.display_name}</div>
                                <div className="add-panel__result-email">{user.email}</div>
                            </div>
                            <button
                                className="add-panel__save-btn add-panel__result-btn"
                                onClick={() => handleAdd(user)}
                                disabled={added}
                            >
                                {added ? 'Agregado' : 'Agregar'}
                            </button>
                        </div>
                    );
                })}
            </div>

        </section>
    );
};

export default AddContactPanel;
