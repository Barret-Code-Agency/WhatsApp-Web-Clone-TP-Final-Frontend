
import React, { useState, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import '../../styles/BackupPanel.css';

export default function BackupPanel() {
    const { exportBackup, importBackup } = useChat();
    const [status, setStatus] = useState(null);
    const [msg, setMsg] = useState('');
    const fileRef = useRef(null);

    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const result = await importBackup(file);
            setMsg(result);
            setStatus('ok');
        } catch (err) {
            setMsg(String(err));
            setStatus('error');
        }
        setTimeout(() => setStatus(null), 3000);
        e.target.value = ''; // reset input
    };

    return (
        <div className="bp__container">
            <p className="bp__desc">
                Exportá todos tus chats y reacciones en un archivo para hacer una copia de seguridad o restaurarlos más tarde.
            </p>

            <button className="bp__btn bp__btn--export" onClick={exportBackup}>
                <span>⬇️</span> Exportar chats
            </button>

            <button className="bp__btn bp__btn--import" onClick={() => fileRef.current?.click()}>
                <span>⬆️</span> Importar backup
            </button>
            <input
                ref={fileRef}
                type="file"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={handleImport}
            />

            {status && (
                <div className={`bp__toast bp__toast--${status}`}>
                    {status === 'ok' ? '✓' : '✗'} {msg}
                </div>
            )}
        </div>
    );
}
