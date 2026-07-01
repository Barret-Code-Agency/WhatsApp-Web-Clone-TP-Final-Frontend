import { api } from './api.js';

// Estados (stories) vigentes de todos los usuarios, del más nuevo al más viejo.
export const listStatuses = async () => {
    const data = await api.get('/api/status');
    return data.statuses;
};

// Publica un estado propio. type: 'text' | 'image'. background: color para los de texto.
export const publishStatus = async ({ content, content_type = 'text', background = null }) => {
    const data = await api.post('/api/status', { content, content_type, background });
    return data.status;
};

export const deleteStatus = async (statusId) => {
    await api.delete(`/api/status/${statusId}`);
    return statusId;
};
