import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { getGroup } from '../../services/groupService.js';
import '../../styles/ChatWindow.css';

const GroupChatWindow = ({ isMobile, onBack }) => {
    const { group_id } = useParams();
    const [text, setText] = useState('');
    const [members, setMembers] = useState([]);
    const scrollRef = useRef(null);
    const { groups, messages, openGroupChat, sendGroupMessage } = useChat();

    const group = useMemo(
        () => (groups || []).find(g => String(g.group_id) === String(group_id)),
        [groups, group_id]
    );
    const chatMessages = useMemo(
        () => (messages && messages[String(group_id)]) || [],
        [messages, group_id]
    );

    // Trae los miembros para el subtitulo del header
    useEffect(() => {
        if (!group_id) return;
        getGroup(group_id).then(data => setMembers(data.members || [])).catch(() => { });
    }, [group_id]);

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

    if (!group) return <div className="cw__error">Grupo no encontrado</div>;

    const memberNames = members.map(m => m.user_id?.display_name).filter(Boolean).join(', ');

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
        </div>
    );
};

export default GroupChatWindow;
