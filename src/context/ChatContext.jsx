import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { getToken, clearToken } from '../services/api.js';
import {
    listContacts as apiListContacts,
    searchUsers as apiSearchUsers,
    addContact as apiAddContact
} from '../services/contactService.js';
import {
    openPrivateConversation,
    getMessages as apiGetMessages,
    sendMessage as apiSendMessage,
    sendBotReply as apiSendBotReply
} from '../services/conversationService.js';
import {
    listGroups as apiListGroups,
    createGroup as apiCreateGroup
} from '../services/groupService.js';
import { mapContact } from '../mappers/contactMapper.js';
import { mapMessage } from '../mappers/messageMapper.js';
import { mapGroup } from '../mappers/groupMapper.js';
import { STORAGE_KEYS } from '../constants/storage.js';
import { GROQ } from '../constants/groq.js';

const ChatContext = createContext();

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

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
        const response = await fetch(GROQ.URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ.MODEL,
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
                max_tokens: GROQ.MAX_TOKENS
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

    const [currentUser, setCurrentUserState] = useState(() => loadFromStorage(STORAGE_KEYS.CURRENT_USER, null));
    const [userName, setUserNameState] = useState(() => loadFromStorage(STORAGE_KEYS.USER, ''));
    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [messages, setMessages] = useState({});
    const [unreadCounts, setUnreadCounts] = useState(() => loadFromStorage(STORAGE_KEYS.UNREAD, {}));
    const [reactions, setReactions] = useState(() => loadFromStorage(STORAGE_KEYS.REACTIONS, {}));
    const [isTyping, setIsTyping] = useState(null);

    // Cache: id del contacto (user) -> id de la conversacion privada
    const conversationMapRef = useRef({});

    useEffect(() => { saveToStorage(STORAGE_KEYS.UNREAD, unreadCounts); }, [unreadCounts]);
    useEffect(() => { saveToStorage(STORAGE_KEYS.REACTIONS, reactions); }, [reactions]);

    // Trae los contactos del usuario desde la API
    const loadContacts = useCallback(async () => {
        try {
            const list = await apiListContacts();
            setContacts(list.map(mapContact));
        } catch (err) {
            console.error('No se pudieron cargar los contactos:', err.message);
        }
    }, []);

    const loadGroups = useCallback(async () => {
        try {
            const list = await apiListGroups();
            setGroups(list.map(mapGroup));
        } catch (err) {
            console.error('No se pudieron cargar los grupos:', err.message);
        }
    }, []);

    // Carga contactos y grupos al montar si ya hay sesion iniciada (fetch en el montaje)
    useEffect(() => {
        if (!getToken()) return;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadContacts();
        loadGroups();
    }, [loadContacts, loadGroups]);

    const setCurrentUser = (user) => {
        setCurrentUserState(user);
        saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
        const name = user?.display_name || '';
        setUserNameState(name);
        saveToStorage(STORAGE_KEYS.USER, name);
    };

    const searchUsers = useCallback((query) => apiSearchUsers(query), []);

    const addContact = useCallback(async (userId, alias) => {
        await apiAddContact(userId, alias);
        await loadContacts();
    }, [loadContacts]);

    // Asegura la conversacion privada con un contacto y devuelve su id (cacheado)
    const ensureConversation = useCallback(async (contactUserId) => {
        let convId = conversationMapRef.current[contactUserId];
        if (!convId) {
            const conversation = await openPrivateConversation(contactUserId);
            convId = conversation._id;
            conversationMapRef.current[contactUserId] = convId;
        }
        return convId;
    }, []);

    // Abre / recarga un chat: trae los mensajes persistidos de la API
    const openConversation = useCallback(async (contactUserId) => {
        try {
            const convId = await ensureConversation(contactUserId);
            const apiMessages = await apiGetMessages(convId);
            setMessages(prev => ({
                ...prev,
                [contactUserId]: apiMessages.map(m => mapMessage(m, currentUser?.id))
            }));
        } catch (err) {
            console.error('No se pudo abrir el chat:', err.message);
        }
    }, [ensureConversation, currentUser]);

    const markAsRead = useCallback((contactId) =>
        setUnreadCounts(prev => ({ ...prev, [contactId]: 0 })), []);

    const logout = () => {
        clearToken();
        Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
        conversationMapRef.current = {};
        setContacts([]);
        setGroups([]);
        setMessages({});
        setUnreadCounts({});
        setCurrentUserState(null);
        setUserNameState('');
        navigate('/');
    };

    const sendMessage = useCallback(async (contactUserId, text) => {
        const contact = contacts.find(c => String(c.id_usuario) === String(contactUserId));
        if (!contact) return;

        try {
            const convId = await ensureConversation(contactUserId);

            // 1) Persisto mi mensaje
            const myMsg = await apiSendMessage(convId, text);
            setMessages(prev => ({
                ...prev,
                [contactUserId]: [...(prev[contactUserId] || []), mapMessage(myMsg, currentUser?.id)]
            }));

            // 2) Si el contacto es un crack (bot): genero la respuesta con IA y la persisto
            if (contact.es_bot) {
                setIsTyping(contactUserId);
                const replyText = await getAIResponse(contact, userName, text);
                const botMsg = await apiSendBotReply(convId, replyText);
                setMessages(prev => ({
                    ...prev,
                    [contactUserId]: [...(prev[contactUserId] || []), mapMessage(botMsg, currentUser?.id)]
                }));
                setIsTyping(null);
            }
        } catch (err) {
            console.error('No se pudo enviar el mensaje:', err.message);
            setIsTyping(null);
        }
    }, [contacts, currentUser, userName, ensureConversation]);

    // ── Grupos ──────────────────────────────────────────────
    const createGroup = useCallback(async (name, memberIds) => {
        const group = await apiCreateGroup(name, memberIds);
        await loadGroups();
        return mapGroup(group);
    }, [loadGroups]);

    // Abre / recarga el chat de un grupo (los mensajes van por su conversation_id)
    const openGroupChat = useCallback(async (groupId, conversationId) => {
        try {
            const apiMessages = await apiGetMessages(conversationId);
            setMessages(prev => ({
                ...prev,
                [groupId]: apiMessages.map(m => mapMessage(m, currentUser?.id))
            }));
        } catch (err) {
            console.error('No se pudo abrir el grupo:', err.message);
        }
    }, [currentUser]);

    const sendGroupMessage = useCallback(async (groupId, conversationId, text) => {
        try {
            const msg = await apiSendMessage(conversationId, text);
            setMessages(prev => ({
                ...prev,
                [groupId]: [...(prev[groupId] || []), mapMessage(msg, currentUser?.id)]
            }));
        } catch (err) {
            console.error('No se pudo enviar al grupo:', err.message);
        }
    }, [currentUser]);

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
                    if (data.reactions) setReactions(data.reactions);
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
            currentUser,
            userName,
            setCurrentUser,
            isTyping,
            logout,
            unreadCounts,
            markAsRead,
            toggleReaction,
            getReactions,
            exportBackup,
            importBackup,
            loadContacts,
            searchUsers,
            addContact,
            openConversation,
            groups,
            loadGroups,
            createGroup,
            openGroupChat,
            sendGroupMessage,
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
