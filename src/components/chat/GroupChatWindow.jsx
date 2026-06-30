import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Send, MoreVertical, Pencil, Trash2, X, UserPlus } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { getGroup } from '../../services/groupService.js';
import '../../styles/ChatWindow.css';

const GroupChatWindow = ({ isMobile, onBack }) => {
    const { group_id } = useParams();
    const [text, setText] = useState('');
    const [members, setMembers] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null); // 'edit' | 'delete' | null
    const [nameInput, setNameInput] = useState('');
    const [busy, setBusy] = useState(false);
    const scrollRef = useRef(null);
    const menuRef = useRef(null);
    const { groups, contacts, messages, openGroupChat, sendGroupMessage, editGroup, deleteGroup, addGroupMember } = useChat();

    const group = useMemo(
        () => (groups || []).find(g => String(g.group_id) === String(group_id)),
        [groups, group_id]
    );
    const chatMessages = useMemo(
        () => (messages && messages[String(group_id)]) || [],
        [messages, group_id]
    );

    // Trae los miembros (para el subtitulo del header y la lista de "agregar")
    const refreshMembers = useCallback(() => {
        if (!group_id) return Promise.resolve();
        return getGroup(group_id).then(data => setMembers(data.members || [])).catch(() => { });
    }, [group_id]);

    useEffect(() => { refreshMembers(); }, [refreshMembers]);

    // Cierra el menu al hacer click fuera
    useEffect(() => {
        const handler = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target))
                setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Carga los mensajes del grupo y los refresca por polling
    useEffect(() => {
        if (!group || !group.conversation_id) return;
        openGroupChat(group.group_id, group.conversation_id);
        const interval = setInterval(() => openGroupChat(group.group_id, group.conversation_id), 4000);
        return () => clearInterval(interval);
    }, [group, openGroupChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() || !group) return;
        sendGroupMessage(group.group_id, group.conversation_id, text);
        setText('');
    };

    const openEdit = () => {
        setNameInput(group.name);
        setModalMode('edit');
        setMenuOpen(false);
    };

    const openDelete = () => {
        setModalMode('delete');
        setMenuOpen(false);
    };

    const openAddMember = () => {
        setModalMode('add');
        setMenuOpen(false);
    };

    const handleAddMember = async (userId) => {
        setBusy(true);
        try {
            await addGroupMember(group.group_id, userId);
            await refreshMembers();
        } catch (err) {
            console.error('No se pudo agregar el miembro:', err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleSaveEdit = async () => {
        const name = nameInput.trim();
        if (!name) return;
        setBusy(true);
        try {
            await editGroup(group.group_id, { name });
            setModalMode(null);
        } catch (err) {
            console.error('No se pudo editar el grupo:', err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        setBusy(true);
        try {
            await deleteGroup(group.group_id);
            onBack();
        } catch (err) {
            console.error('No se pudo eliminar el grupo:', err.message);
            setBusy(false);
        }
    };

    if (!group) return <div className="cw__error">Grupo no encontrado</div>;

    const memberNames = members.map(m => m.user_id?.display_name).filter(Boolean).join(', ');

    // Usuarios del directorio que todavía no están en el grupo
    const memberIds = new Set(members.map(m => String(m.user_id?._id)));
    const candidatos = (contacts || []).filter(c => !memberIds.has(String(c.id_usuario)));

    return (
        <div className="cw__container">
            <div className="cw__wallpaper" />

            <header className="cw__header">
                {isMobile && (
                    <button className="cw__back-btn" onClick={onBack} title="Volver">‹</button>
                )}
                <div className="cw__header-avatar cw__header-avatar--group">👥</div>
                <div className="cw__header-info">
                    <span className="cw__header-name">{group.name}</span>
                    <span className="cw__header-status">
                        {memberNames || `${members.length} miembros`}
                    </span>
                </div>

                <div className="cw__header-actions" ref={menuRef}>
                    <button className="cw__menu-btn" onClick={() => setMenuOpen(v => !v)} title="Opciones">
                        <MoreVertical size={20} />
                    </button>
                    {menuOpen && (
                        <div className="cw__menu">
                            <button className="cw__menu-item" onClick={openAddMember}>
                                <UserPlus size={16} /> Agregar miembro
                            </button>
                            <button className="cw__menu-item" onClick={openEdit}>
                                <Pencil size={16} /> Editar grupo
                            </button>
                            <button className="cw__menu-item cw__menu-item--danger" onClick={openDelete}>
                                <Trash2 size={16} /> Eliminar grupo
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="cw__messages">
                {chatMessages.map(m => (
                    <div key={m.id} className={`cw__bubble ${m.mine ? 'cw__bubble--me' : 'cw__bubble--them'}`}>
                        {!m.mine && <span className="cw__bubble-author">{m.author}</span>}
                        <p className="cw__bubble-text">{m.text}</p>
                        <div className="cw__bubble-footer">
                            <span className="cw__bubble-time">{m.time}</span>
                        </div>
                    </div>
                ))}
                <div ref={scrollRef} />
            </main>

            <footer className="cw__footer">
                <form className="cw__form" onSubmit={handleSubmit}>
                    <input
                        className="cw__input"
                        type="text"
                        placeholder="Escribe un mensaje"
                        value={text}
                        onChange={e => setText(e.target.value)}
                    />
                    <button className="cw__send-btn" type="submit" disabled={!text.trim()}>
                        <Send size={20} />
                    </button>
                </form>
            </footer>

            {modalMode && (
                <div className="cw__modal-overlay" onClick={() => !busy && setModalMode(null)}>
                    <div className="cw__modal" onClick={e => e.stopPropagation()}>
                        <button className="cw__modal-close" onClick={() => !busy && setModalMode(null)} title="Cerrar">
                            <X size={18} />
                        </button>
                        {modalMode === 'edit' && (
                            <>
                                <h3 className="cw__modal-title">Editar grupo</h3>
                                <input
                                    className="cw__modal-input"
                                    type="text"
                                    value={nameInput}
                                    maxLength={40}
                                    placeholder="Nombre del grupo"
                                    onChange={e => setNameInput(e.target.value)}
                                    autoFocus
                                />
                                <div className="cw__modal-actions">
                                    <button className="cw__modal-btn" onClick={() => setModalMode(null)} disabled={busy}>Cancelar</button>
                                    <button className="cw__modal-btn cw__modal-btn--primary" onClick={handleSaveEdit} disabled={busy}>
                                        {busy ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>
                            </>
                        )}
                        {modalMode === 'delete' && (
                            <>
                                <h3 className="cw__modal-title">Eliminar grupo</h3>
                                <p className="cw__modal-text">
                                    ¿Querés eliminar el grupo {group.name}? Se borra para todos sus miembros.
                                </p>
                                <div className="cw__modal-actions">
                                    <button className="cw__modal-btn" onClick={() => setModalMode(null)} disabled={busy}>Cancelar</button>
                                    <button className="cw__modal-btn cw__modal-btn--danger" onClick={handleDelete} disabled={busy}>
                                        {busy ? 'Eliminando...' : 'Eliminar'}
                                    </button>
                                </div>
                            </>
                        )}
                        {modalMode === 'add' && (
                            <>
                                <h3 className="cw__modal-title">Agregar miembro</h3>
                                <div className="cw__member-list">
                                    {candidatos.length === 0 ? (
                                        <p className="cw__modal-text">No hay más usuarios para agregar.</p>
                                    ) : (
                                        candidatos.map(c => (
                                            <button
                                                key={c.id_usuario}
                                                className="cw__member-item"
                                                onClick={() => handleAddMember(c.id_usuario)}
                                                disabled={busy}
                                            >
                                                <img
                                                    src={c.avatar_url || '/images/avatar.avif'}
                                                    alt={c.name}
                                                    className="cw__member-avatar"
                                                    onError={e => { e.target.src = '/images/avatar.avif'; }}
                                                />
                                                <span className="cw__member-name">{c.name}</span>
                                                <UserPlus size={16} className="cw__member-add" />
                                            </button>
                                        ))
                                    )}
                                </div>
                                <div className="cw__modal-actions">
                                    <button className="cw__modal-btn" onClick={() => setModalMode(null)} disabled={busy}>Cerrar</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupChatWindow;
