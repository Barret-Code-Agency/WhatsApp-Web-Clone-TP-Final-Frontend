import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { Send, Check, CheckCheck, Smile, MoreVertical, Pencil, Trash2, X } from 'lucide-react';
import SmartHints from '../../features/smart-hints/SmartHints';
import EmojiPicker from 'emoji-picker-react';
import { MESSAGE_STATUS } from '../../constants/ui.js';

import '../../styles/ChatWindow.css';
import '../../styles/emoji-additions.css'

const ChatWindow = ({ isMobile, onBack }) => {
    const { id_usuario } = useParams();
    const [text, setText] = useState('');
    const [showInputPicker, setShowInputPicker] = useState(false);
    const [reactionMsgId, setReactionMsgId] = useState(null);
    const scrollRef = useRef(null);
    const inputPickerRef = useRef(null);
    const reactionPickerRef = useRef(null);
    const menuRef = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [modalMode, setModalMode] = useState(null); // 'edit' | 'delete' | null
    const [aliasInput, setAliasInput] = useState('');
    const [busy, setBusy] = useState(false);

    const { contacts, messages, sendMessage, isTyping, markAsRead, toggleReaction, getReactions, openConversation, editContact, deleteContact } = useChat();

    const contact = useMemo(
        () => (contacts || []).find(c => String(c.id_usuario) === String(id_usuario)),
        [contacts, id_usuario]
    );

    const chatMessages = useMemo(
        () => (messages && messages[String(id_usuario)]) || [],
        [messages, id_usuario]
    );

    // Marca como leído al abrir el chat
    useEffect(() => {
        if (id_usuario) markAsRead(id_usuario);
    }, [id_usuario, markAsRead]);

    // Carga los mensajes persistidos al abrir el chat y los refresca por polling
    useEffect(() => {
        if (!id_usuario) return;
        openConversation(id_usuario);
        const interval = setInterval(() => openConversation(id_usuario), 4000);
        return () => clearInterval(interval);
    }, [id_usuario, openConversation]);

    // Scroll al último mensaje
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    // Cierra pickers al hacer click fuera
    useEffect(() => {
        const handler = (e) => {
            if (inputPickerRef.current && !inputPickerRef.current.contains(e.target))
                setShowInputPicker(false);
            if (reactionPickerRef.current && !reactionPickerRef.current.contains(e.target))
                setReactionMsgId(null);
            if (menuRef.current && !menuRef.current.contains(e.target))
                setMenuOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        sendMessage(id_usuario, text);
        setText('');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const onInputEmoji = (emojiData) => {
        setText(prev => prev + emojiData.emoji);
        setShowInputPicker(false);
    };

    const onReactionEmoji = (emojiData, msgId) => {
        toggleReaction(id_usuario, msgId, emojiData.emoji);
        setReactionMsgId(null);
    };

    const openEdit = () => {
        setAliasInput(contact.name);
        setModalMode('edit');
        setMenuOpen(false);
    };

    const openDelete = () => {
        setModalMode('delete');
        setMenuOpen(false);
    };

    const handleSaveEdit = async () => {
        const alias = aliasInput.trim();
        if (!alias) return;
        setBusy(true);
        try {
            await editContact(contact.contact_id, { alias });
            setModalMode(null);
        } catch (err) {
            console.error('No se pudo editar el contacto:', err.message);
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = async () => {
        setBusy(true);
        try {
            await deleteContact(contact.contact_id);
            onBack();
        } catch (err) {
            console.error('No se pudo eliminar el contacto:', err.message);
            setBusy(false);
        }
    };

    if (!contact) return <div className="cw__error">Contacto no encontrado</div>;

    return (
        <div className="cw__container">
            <div className="cw__wallpaper" />

            <header className="cw__header">
                {isMobile && (
                    <button className="cw__back-btn" onClick={onBack} title="Volver">
                        ‹
                    </button>
                )}
                <img src={contact.evatar_url} alt={contact.name} className="cw__header-avatar" />
                <div className="cw__header-info">
                    <span className="cw__header-name">{contact.name}</span>
                    <span className="cw__header-status">
                        {isTyping === id_usuario ? 'escribiendo...' : contact.conection}
                    </span>
                </div>

                <div className="cw__header-actions" ref={menuRef}>
                    <button className="cw__menu-btn" onClick={() => setMenuOpen(v => !v)} title="Opciones">
                        <MoreVertical size={20} />
                    </button>
                    {menuOpen && (
                        <div className="cw__menu">
                            <button className="cw__menu-item" onClick={openEdit}>
                                <Pencil size={16} /> Editar contacto
                            </button>
                            <button className="cw__menu-item cw__menu-item--danger" onClick={openDelete}>
                                <Trash2 size={16} /> Eliminar contacto
                            </button>
                        </div>
                    )}
                </div>
            </header>

            <main className="cw__messages">
                {chatMessages.map(m => {
                    const mine = m.mine;
                    const msgReactions = getReactions(id_usuario, m.id);
                    const hasReactions = Object.keys(msgReactions).length > 0;

                    return (
                        <div
                            key={m.id}
                            className={`cw__bubble ${mine ? 'cw__bubble--me' : 'cw__bubble--them'}`}
                            onClick={() => {
                                setShowInputPicker(false);
                                setReactionMsgId(prev => prev === m.id ? null : m.id);
                            }}
                        >
                            <p className="cw__bubble-text">{m.text}</p>
                            <SmartHints text={m.text} />
                            <div className="cw__bubble-footer">
                                <span className="cw__bubble-time">{m.time}</span>
                                {mine && (
                                    m.status === MESSAGE_STATUS.READ
                                        ? <CheckCheck size={16} className="cw__tick cw__tick--read" />
                                        : <Check size={16} className="cw__tick" />
                                )}
                            </div>

                            {hasReactions && (
                                <div className="cw__reactions">
                                    {Object.entries(msgReactions).map(([emoji, count]) => (
                                        <button
                                            key={emoji}
                                            className="cw__reaction-chip"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleReaction(id_usuario, m.id, emoji);
                                            }}
                                        >
                                            {emoji}{count > 1 && <span>{count}</span>}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {reactionMsgId === m.id && (
                                <div
                                    className="cw__reaction-picker"
                                    ref={reactionPickerRef}
                                    onClick={e => e.stopPropagation()}
                                >
                                    <EmojiPicker
                                        onEmojiClick={(emojiData) => onReactionEmoji(emojiData, m.id)}
                                        height={380}
                                        width={300}
                                        skinTonesDisabled
                                        previewConfig={{ showPreview: false }}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}

                {isTyping === id_usuario && (
                    <div className="cw__bubble cw__bubble--them cw__bubble--typing">
                        <span className="cw__typing-dot" />
                        <span className="cw__typing-dot" />
                        <span className="cw__typing-dot" />
                    </div>
                )}

                <div ref={scrollRef} />
            </main>

            <footer className="cw__footer">
                {showInputPicker && (
                    <div className="cw__input-picker" ref={inputPickerRef}>
                        <EmojiPicker
                            onEmojiClick={onInputEmoji}
                            height={380}
                            width={300}
                            skinTonesDisabled
                            previewConfig={{ showPreview: false }}
                        />
                    </div>
                )}

                <form className="cw__form" onSubmit={handleSubmit}>
                    <button
                        type="button"
                        className="cw__emoji-btn"
                        onClick={() => {
                            setReactionMsgId(null);
                            setShowInputPicker(prev => !prev);
                        }}
                        title="Emojis"
                    >
                        <Smile size={22} />
                    </button>

                    <input
                        className="cw__input"
                        type="text"
                        placeholder="Escribe un mensaje"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
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
                        {modalMode === 'edit' ? (
                            <>
                                <h3 className="cw__modal-title">Editar contacto</h3>
                                <input
                                    className="cw__modal-input"
                                    type="text"
                                    value={aliasInput}
                                    maxLength={40}
                                    placeholder="Nombre del contacto"
                                    onChange={e => setAliasInput(e.target.value)}
                                    autoFocus
                                />
                                <div className="cw__modal-actions">
                                    <button className="cw__modal-btn" onClick={() => setModalMode(null)} disabled={busy}>Cancelar</button>
                                    <button className="cw__modal-btn cw__modal-btn--primary" onClick={handleSaveEdit} disabled={busy}>
                                        {busy ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="cw__modal-title">Eliminar contacto</h3>
                                <p className="cw__modal-text">
                                    ¿Querés eliminar a {contact.name} de tus contactos? También se borra la conversación.
                                </p>
                                <div className="cw__modal-actions">
                                    <button className="cw__modal-btn" onClick={() => setModalMode(null)} disabled={busy}>Cancelar</button>
                                    <button className="cw__modal-btn cw__modal-btn--danger" onClick={handleDelete} disabled={busy}>
                                        {busy ? 'Eliminando...' : 'Eliminar'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatWindow;
