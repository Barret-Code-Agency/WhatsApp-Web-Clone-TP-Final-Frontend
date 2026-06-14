import React, { useState } from 'react';
import { Users, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import '../../styles/AddContactPanel.css';

const NewGroupPanel = ({ onClose }) => {
    const { contacts, createGroup } = useChat();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const toggle = (userId) =>
        setSelected(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (name.trim().length < 2) {
            setError('El nombre debe tener al menos 2 caracteres');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const group = await createGroup(name.trim(), selected);
            onClose();
            navigate(`/group/${group.group_id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="add-panel animate-slide-in">
            <div className="add-panel__header">
                <button className="add-panel__close" onClick={onClose}>✕</button>
                <h2 className="add-panel__title">Nuevo grupo</h2>
            </div>

            <form className="add-panel__form" onSubmit={handleCreate}>
                <div className="add-panel__field">
                    <span className="add-panel__icon"><Users size={18} /></span>
                    <div className="add-panel__input-wrapper">
                        <input
                            type="text"
                            placeholder="Nombre del grupo"
                            className="add-panel__input"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>
                <button type="submit" className="add-panel__save-btn" disabled={loading || name.trim().length < 2}>
                    {loading ? 'Creando...' : `Crear grupo (${selected.length})`}
                </button>
            </form>

            {error && <p className="add-panel__error">{error}</p>}

            <p className="add-panel__section-label">Agregá miembros</p>
            <div className="add-panel__results">
                {contacts.map(c => {
                    const checked = selected.includes(c.id_usuario);
                    return (
                        <div
                            key={c.id_usuario}
                            className={`add-panel__result add-panel__result--selectable ${checked ? 'add-panel__result--on' : ''}`}
                            onClick={() => toggle(c.id_usuario)}
                        >
                            <div className="add-panel__result-avatar">
                                {c.evatar_url
                                    ? <img src={c.evatar_url} alt={c.name} />
                                    : <Users size={20} />}
                            </div>
                            <div className="add-panel__result-info">
                                <div className="add-panel__result-name">{c.name}</div>
                            </div>
                            {checked && <span className="add-panel__check"><Check size={18} /></span>}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default NewGroupPanel;
