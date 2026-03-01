import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useChat } from '../../context/ChatContext';
import { Send, Check, CheckCheck, Smile } from 'lucide-react';
import SmartHints from '../../features/smart-hints/SmartHints';
import EmojiPicker from 'emoji-picker-react';

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

    const { contacts, messages, sendMessage, userName, isTyping, markAsRead, toggleReaction, getReactions } = useChat();

    const contactNames = useMemo(
        () => new Set((contacts || []).map(c => c.name.trim().toLowerCase())),
        [contacts]
    );
    const isMyMessage = (author) => !contactNames.has(String(author).trim().toLowerCase());

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
            </header>

            <main className="cw__messages">
                {chatMessages.map(m => {
                    const mine = isMyMessage(m.author);
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
                                    m.status === 'read'
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
        </div>
    );
};

export default ChatWindow;
