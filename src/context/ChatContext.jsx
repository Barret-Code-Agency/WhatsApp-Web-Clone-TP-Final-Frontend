import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { contactsData } from '../data/contactsData.jsx';
import { initialMessages } from "../data/initialMessages.js";
import { useNavigate } from "react-router-dom";
import { applyTheme, PRESETS } from './ThemeContext';

const ChatContext = createContext();

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

const loadFromStorage = (key, fallback) => {
    try {
        const saved = localStorage.getItem(key);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed !== null && parsed !== undefined) return parsed;
        }
    } catch {
        console.warn("localStorage no disponible.");
    }
    return typeof fallback === 'function' ? fallback() : fallback;
};

const saveToStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.warn("No se pudo guardar en localStorage.");
    }
};

const formatTime = (date) =>
    date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });

const buildUnreadCounts = (msgs) => {
    const counts = {};
    const opciones = [1, 1, 2, 2, 3];
    Object.keys(msgs).forEach((id, index) => {
        counts[id] = index < 10 ? 0 : opciones[index % opciones.length];
    });
    return counts;
};

const getFallbackResponse = (userName, userText = '') => {
    const respuestas = [
        `¡Qué grande ${userName}! Me gustó eso de: "${userText}". Sos un crack.`,
        "Totalmente de acuerdo contigo, ¡hay que seguir metiéndole!",
        `Interesante lo que decís, ${userName}... lo voy a tener en cuenta.`,
        "¡Jajaja, Amigo, qué genio! Me hacés reír mucho. Nos vemos pronto.",
        "Ahora justo estoy por empezar a entrenar, ¡hablamos en un rato!",
        `¡Esa es la actitud, ${userName}! La disciplina lo es todo.`,
        `¡Un abrazo grande, ${userName}! Gracias por el aguante.`,
        `Exactamente eso hablaba el otro día con el equipo, ${userName}. Estás en lo cierto.`,
        "No es fácil llegar a la cima, pero con gente como vos apoyando, todo es mejor.",
        `Me dejas pensando con eso de "${userText}"... Tenés visión de juego, amigo.`,
        "¡Grande! La humildad y el trabajo duro no se negocian. ¡Seguimos!",
        "Perdona que tarde en responder, estamos concentrados para lo que viene. ¡Vamos con todo!",
        `Me sirve mucho tu mensaje, ${userName}. Siempre es bueno escuchar otra opinión.`,
        "¡Eso es! Paso a paso, pero siempre hacia adelante. No hay secretos.",
        `¡Qué fenómeno! Si todos pensaran como vos, ${userName}, el mundo sería otra cosa.`,
        "Gracias por estar en las buenas y en las malas. Eso es lo que vale de verdad.",
        `Uff, qué buena frase me tiraste. Me la guardo para la charla de hoy. ¡Un crack!`
    ];
    return respuestas[Math.floor(Math.random() * respuestas.length)];
};

const getAIResponse = async (contact, userName, userText) => {
    const bioContext = contact.estado_bio || "Deportista profesional de alto rendimiento.";
    try {
        const response = await fetch(GROQ_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "system",
                    content: `Actúa como ${contact.name}, deportista famoso. Estás hablando por WhatsApp con un amigo cercano de toda la vida llamado ${userName}. 
Bio: ${bioContext}
Reglas:
1. Tono informal, relajado y con mucha confianza. No sos un asistente, sos un colega.
2. Español rioplatense obligatorio: voseo (vení, sentí, mirá), pero sin che y malas palabras.
3. Respondé con lógica sobre tu carrera deportiva. Si te preguntan algo personal, seguile la corriente con humor.
4. Si te pasan un email, teléfono o fecha, decí que lo vas a agendar.
5. Usá emoticones ocasionalmente. Respuestas breves como en un chat de celular.
Usuario dice: ${userText}`
                }],
                max_tokens: 150
            })
        });
        const data = await response.json();
        if (!response.ok) {
            console.error('Groq error:', data.error?.message);
            return getFallbackResponse(userName, userText);
        }
        return data.choices[0].message.content;
    } catch (err) {
        console.error('Fetch error:', err);
        return getFallbackResponse(userName, userText);
    }
};

export const ChatProvider = ({ children }) => {
    const navigate = useNavigate();

    const [userName, setUserNameState] = useState(
        () => loadFromStorage('cracks_user', '')
    );

    const [messages, setMessages] = useState(() => {
        const savedUser = loadFromStorage('cracks_user', '');
        const parsed = loadFromStorage('cracks_messages', null);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
        return initialMessages(savedUser || 'Usuario');
    });

    const [unreadCounts, setUnreadCounts] = useState(() => {
        const saved = loadFromStorage('cracks_unread', null);
        if (saved) return saved;
        const msgs = loadFromStorage('cracks_messages', null)
            || initialMessages(loadFromStorage('cracks_user', 'Usuario'));
        return buildUnreadCounts(msgs);
    });

    const [reactions, setReactions] = useState(
        () => loadFromStorage('cracks_reactions', {})
    );

    const [isTyping, setIsTyping] = useState(null);
    const contacts = contactsData;

    useEffect(() => { saveToStorage('cracks_messages', messages); }, [messages]);
    useEffect(() => { saveToStorage('cracks_unread', unreadCounts); }, [unreadCounts]);
    useEffect(() => { saveToStorage('cracks_reactions', reactions); }, [reactions]);

    const resetUserSession = (name) => {
        const cleanName = String(name).trim();
        const freshMsgs = initialMessages(cleanName);
        const freshUnread = buildUnreadCounts(freshMsgs);
        setUserNameState(cleanName);
        saveToStorage('cracks_user', cleanName);
        setMessages(freshMsgs);
        setUnreadCounts(freshUnread);
    };

    const markAsRead = useCallback((contactId) =>
        setUnreadCounts(prev => ({ ...prev, [contactId]: 0 })), []);

    const logout = () => {
        ['cracks_user', 'cracks_messages', 'cracks_unread', 'cracks_reactions']
            .forEach(k => localStorage.removeItem(k));
        navigate('/');
    };

    const sendMessage = (contactId, userText) => {
        const contact = contacts.find(c => c.id_usuario === contactId);
        if (!contact) return;

        const newMessage = {
            id: Date.now(),
            text: userText,
            author: userName,
            time: formatTime(new Date()),
            status: 'sent'
        };

        setMessages(prev => ({
            ...prev,
            [contactId]: [...(prev[contactId] || []), newMessage]
        }));
        setIsTyping(contactId);

        setTimeout(() => {
            getAIResponse(contact, userName, userText).then(responseText => {
                const reply = {
                    id: Date.now() + 1,
                    text: responseText,
                    author: contact.name,
                    time: formatTime(new Date()),
                    status: 'read'
                };
                setMessages(prev => {
                    const updated = (prev[contactId] || []).map(m =>
                        String(m.author).trim().toLowerCase() === String(userName).trim().toLowerCase()
                            ? { ...m, status: 'read' } : m
                    );
                    return { ...prev, [contactId]: [...updated, reply] };
                });
                setUnreadCounts(prev => ({ ...prev, [contactId]: (prev[contactId] || 0) + 1 }));
                setIsTyping(null);
            });
        }, 3000);
    };

    const toggleReaction = (contactId, msgId, emoji) => {
        setReactions(prev => {
            const chatR = { ...(prev[contactId] || {}) };
            const msgR = { ...(chatR[msgId] || {}) };
            if (msgR[emoji] > 0) delete msgR[emoji];
            else msgR[emoji] = 1;
            return { ...prev, [contactId]: { ...chatR, [msgId]: msgR } };
        });
    };

    const getReactions = (contactId, msgId) =>
        reactions?.[contactId]?.[msgId] || {};

    const exportBackup = () => {
        const data = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            userName, messages, reactions,
        };
        const a = document.createElement('a');
        a.href = URL.createObjectURL(
            new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        );
        a.download = `cracks-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const importBackup = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.messages) setMessages(data.messages);
                    if (data.reactions) setReactions(data.reactions);
                    if (data.userName) {
                        setUserNameState(data.userName);
                        saveToStorage('cracks_user', data.userName);
                    }
                    resolve('Backup restaurado correctamente');
                } catch { reject('Archivo inválido'); }
            };
            reader.onerror = () => reject('Error al leer el archivo');
            reader.readAsText(file);
        });

    return (
        <ChatContext.Provider value={{
            contacts,
            messages,
            sendMessage,
            userName,
            setUserName: resetUserSession,
            isTyping,
            logout,
            unreadCounts,
            markAsRead,
            toggleReaction,
            getReactions,
            exportBackup,
            importBackup,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
