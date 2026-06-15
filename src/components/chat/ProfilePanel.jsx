import React, { useState, useRef } from 'react';
import { Camera, UserRound, X } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import '../../styles/ProfilePanel.css';

// Redimensiona la imagen en el navegador a un cuadrado chico y la devuelve como data URL JPEG.
// Asi la foto viaja liviana al backend y no hace falta almacenamiento externo.
const resizeToDataUrl = (file, maxSize = 256) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => reject(new Error('No se pudo procesar la imagen'));
        img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsDataURL(file);
});

const ProfilePanel = ({ onClose }) => {
    const { currentUser, updateProfile } = useChat();
    const [name, setName] = useState(currentUser?.display_name || '');
    const [status, setStatus] = useState(currentUser?.status_message || '');
    const [avatar, setAvatar] = useState(currentUser?.avatar_url || '');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [savedMsg, setSavedMsg] = useState('');
    const fileRef = useRef(null);

    const handleFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setError('');
        setSavedMsg('');
        if (!file.type.startsWith('image/')) {
            setError('Elegí un archivo de imagen.');
            return;
        }
        try {
            setAvatar(await resizeToDataUrl(file));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSave = async () => {
        setError('');
        setSavedMsg('');
        if (name.trim().length < 2) {
            setError('El nombre debe tener al menos 2 caracteres.');
            return;
        }
        setSaving(true);
        try {
            await updateProfile({
                display_name: name.trim(),
                status_message: status.trim(),
                avatar_url: avatar
            });
            setSavedMsg('Perfil guardado ✓');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="side-full-panel animate-slide-in">
            <div className="filter-panel-header">
                <button className="close-btn" onClick={onClose}><X size={20} /></button>
                <h2>Mi perfil</h2>
            </div>

            <div className="profile-panel__body">
                <div className="profile-panel__avatar-wrap">
                    <div className="profile-panel__avatar">
                        {avatar
                            ? <img src={avatar} alt="Mi foto de perfil" />
                            : <UserRound size={64} />}
                    </div>
                    <button
                        type="button"
                        className="profile-panel__camera"
                        onClick={() => fileRef.current?.click()}
                        title="Cambiar foto"
                    >
                        <Camera size={18} />
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="profile-panel__file"
                        onChange={handleFile}
                    />
                </div>

                <label className="profile-panel__field">
                    <span className="profile-panel__label">Nombre</span>
                    <input type="text" value={name} maxLength={40} onChange={e => setName(e.target.value)} />
                </label>

                <label className="profile-panel__field">
                    <span className="profile-panel__label">Info</span>
                    <input
                        type="text"
                        value={status}
                        maxLength={120}
                        placeholder="Hola, estoy usando Cracks"
                        onChange={e => setStatus(e.target.value)}
                    />
                </label>

                <label className="profile-panel__field">
                    <span className="profile-panel__label">Email</span>
                    <input type="text" value={currentUser?.email || ''} disabled />
                </label>

                {error && <p className="profile-panel__error">{error}</p>}
                {savedMsg && <p className="profile-panel__saved">{savedMsg}</p>}

                <button type="button" className="profile-panel__save" onClick={handleSave} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
            </div>
        </div>
    );
};

export default ProfilePanel;
