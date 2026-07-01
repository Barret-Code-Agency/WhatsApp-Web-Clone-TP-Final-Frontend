import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useChat } from '../context/ChatContext';
import { listStatuses, publishStatus, deleteStatus } from '../services/statusService';
import '../styles/StatusScreen.css';

const STATUS_DURATION_MS = 8000;
const COLORS = ['#00a884', '#8c52ff', '#ff66c4', '#f5a623', '#3b82f6', '#111b21'];

const timeAgo = (iso) => {
    const diff = Date.now() - new Date(iso).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'Recién';
    if (min < 60) return `Hace ${min} min`;
    const h = Math.floor(min / 60);
    if (h < 24) return `Hace ${h} h`;
    return 'Ayer';
};

// Overlay que reproduce los estados de un mismo autor, uno tras otro.
const StatusOverlay = ({ group, isMine, onClose, onDelete }) => {
    const [index, setIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const timerRef = useRef(null);
    const startRef = useRef(0);
    const items = group.items;
    const current = items[index];

    useEffect(() => {
        startRef.current = Date.now();
        setProgress(0);
        timerRef.current = setInterval(() => {
            const pct = Math.min(((Date.now() - startRef.current) / STATUS_DURATION_MS) * 100, 100);
            setProgress(pct);
            if (pct >= 100) {
                clearInterval(timerRef.current);
                if (index < items.length - 1) setIndex(i => i + 1);
                else onClose();
            }
        }, 80);
        return () => clearInterval(timerRef.current);
    }, [index, items.length, onClose]);

    return (
        <div className="status-overlay" onClick={onClose}>
            <div className="status-overlay-inner" onClick={e => e.stopPropagation()}>
                <div className="status-progress-bar">
                    <div className="status-progress-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="status-overlay-header">
                    <img src={group.user.avatar_url || '/images/avatar.avif'} alt={group.user.display_name} className="status-overlay-avatar" />
                    <span className="status-overlay-name">{group.user.display_name}</span>
                    <span className="status-overlay-time">{timeAgo(current.created_at)}</span>
                    {isMine && (
                        <button className="status-delete-btn" title="Eliminar estado" onClick={() => onDelete(current._id)}>🗑</button>
                    )}
                    <button className="status-close-btn" onClick={onClose}>✕</button>
                </div>
                {current.content_type === 'image'
                    ? <img className="status-media" src={current.content} alt="Estado" />
                    : <div className="status-text-view" style={{ background: current.background || 'var(--rosa, #00a884)' }}>{current.content}</div>}
            </div>
        </div>
    );
};

// Creador de estado: texto (con color de fondo) o imagen por URL.
const StatusCreator = ({ onClose, onPublish }) => {
    const [type, setType] = useState('text');
    const [content, setContent] = useState('');
    const [background, setBackground] = useState(COLORS[0]);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');

    const submit = async () => {
        if (!content.trim()) { setError('Escribí algo para tu estado.'); return; }
        setBusy(true); setError('');
        try {
            await onPublish({ content: content.trim(), content_type: type, background: type === 'text' ? background : null });
        } catch (e) {
            setError(e.message || 'No se pudo publicar el estado.');
            setBusy(false);
        }
    };

    return (
        <div className="status-overlay" onClick={onClose}>
            <div className="status-creator" onClick={e => e.stopPropagation()}>
                <div className="status-creator-header">
                    <h3>Nuevo estado</h3>
                    <button className="status-close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="status-creator-tabs">
                    <button className={`status-creator-tab${type === 'text' ? ' status-creator-tab--on' : ''}`} onClick={() => setType('text')}>Texto</button>
                    <button className={`status-creator-tab${type === 'image' ? ' status-creator-tab--on' : ''}`} onClick={() => setType('image')}>Imagen</button>
                </div>

                {type === 'text' ? (
                    <>
                        <div className="status-creator-preview" style={{ background }}>
                            {content || 'Tu estado…'}
                        </div>
                        <textarea
                            className="status-creator-input"
                            placeholder="Escribí tu estado"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            maxLength={200}
                        />
                        <div className="status-creator-colors">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    className={`status-creator-color${background === c ? ' status-creator-color--on' : ''}`}
                                    style={{ background: c }}
                                    onClick={() => setBackground(c)}
                                    aria-label={`Fondo ${c}`}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {content && (
                            <img className="status-creator-preview-img" src={content} alt="Vista previa" onError={e => { e.target.style.visibility = 'hidden'; }} />
                        )}
                        <input
                            className="status-creator-input"
                            placeholder="Pegá la URL de una imagen"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                    </>
                )}

                {error && <p className="status-creator-error">{error}</p>}
                <button className="status-creator-publish" onClick={submit} disabled={busy}>
                    {busy ? 'Publicando…' : 'Publicar estado'}
                </button>
            </div>
        </div>
    );
};

const StatusItem = ({ group, onClick }) => (
    <div className="status-item" onClick={onClick}>
        <div className="status-avatar-wrapper">
            <div className="status-ring">
                <img src={group.user.avatar_url || '/images/avatar.avif'} alt={group.user.display_name} className="status-img" />
            </div>
        </div>
        <div className="status-info">
            <span className="status-name">{group.user.display_name}</span>
            <span className="status-time">{timeAgo(group.items[0].created_at)}</span>
        </div>
    </div>
);

const StatusScreen = () => {
    const { currentUser } = useChat();
    const [statuses, setStatuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeGroup, setActiveGroup] = useState(null);
    const [creating, setCreating] = useState(false);

    const load = async () => {
        setLoading(true); setError('');
        try {
            setStatuses(await listStatuses());
        } catch (e) {
            setError(e.message || 'No se pudieron cargar los estados.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    // Agrupa los estados por autor, conservando el orden (más nuevo primero).
    const groups = useMemo(() => {
        const map = new Map();
        for (const s of statuses) {
            const u = s.user_id;
            if (!u) continue;
            if (!map.has(u._id)) map.set(u._id, { user: u, items: [] });
            map.get(u._id).items.push(s);
        }
        return [...map.values()];
    }, [statuses]);

    const myGroup = groups.find(g => g.user._id === currentUser?.id) || null;
    const otherGroups = groups.filter(g => g.user._id !== currentUser?.id);

    const handlePublish = async (payload) => {
        await publishStatus(payload);
        setCreating(false);
        await load();
    };

    const handleDelete = async (id) => {
        await deleteStatus(id);
        setActiveGroup(null);
        await load();
    };

    return (
        <div className="status-screen-container">
            <div className="status-item" onClick={() => (myGroup ? setActiveGroup(myGroup) : setCreating(true))}>
                <div className="status-avatar-wrapper">
                    <img src={currentUser?.avatar_url || '/images/avatar.avif'} className="status-img status-img--mine" alt="Mi estado" />
                    <div className="status-add-icon" onClick={(e) => { e.stopPropagation(); setCreating(true); }}>+</div>
                </div>
                <div className="status-info">
                    <div className="status-name">Mi estado</div>
                    <div className="status-time">
                        {myGroup ? `${myGroup.items.length} actualización(es)` : 'Añadir una actualización'}
                    </div>
                </div>
            </div>

            {loading && <div className="status-section-header">Cargando…</div>}
            {error && <div className="status-section-header">{error}</div>}

            {otherGroups.length > 0 && <div className="status-section-header">Recientes</div>}
            {otherGroups.map(g => (
                <StatusItem key={g.user._id} group={g} onClick={() => setActiveGroup(g)} />
            ))}
            {!loading && !error && otherGroups.length === 0 && (
                <p className="status-empty">Todavía no hay estados de otros. ¡Publicá el primero!</p>
            )}

            {activeGroup && (
                <StatusOverlay
                    group={activeGroup}
                    isMine={activeGroup.user._id === currentUser?.id}
                    onClose={() => setActiveGroup(null)}
                    onDelete={handleDelete}
                />
            )}
            {creating && <StatusCreator onClose={() => setCreating(false)} onPublish={handlePublish} />}
        </div>
    );
};

export default StatusScreen;
