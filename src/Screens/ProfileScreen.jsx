import React from 'react';
import { Pencil, Copy } from 'lucide-react';
import avatarImg from "/images/avatar.avif";
import '../styles/ProfileScreen.css'


const ProfileScreen = () => {
    return (
        <div style={{ display: 'flex', height: '100%', backgroundColor: '#0b141a' }}>

            <div style={{
                width: '400px',
                backgroundColor: '#111b21',
                borderRight: '1px solid #2f3b43',
                padding: '20px'
            }}>
                <h2 style={{ color: '#d1d7db', fontSize: '20px', marginBottom: '40px' }}>Perfil</h2>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                    <img
                        src={avatarImg}
                        alt="Avatar"
                        style={{ width: '200px', height: '200px', borderRadius: '50%' }}
                    />
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ color: '#00a884', fontSize: '14px' }}>Nombre</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <span style={{ color: '#d1d7db', fontSize: '17px' }}>B S C</span>
                        <Pencil size={20} style={{ color: '#8696a0', cursor: 'pointer' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ color: '#8696a0', fontSize: '14px' }}>Info.</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <span style={{ color: '#d1d7db', fontSize: '17px' }}>¡Hola! Estoy usando WhatsApp.</span>
                    </div>
                </div>

                <div>
                    <label style={{ color: '#8696a0', fontSize: '14px' }}>Teléfono</label>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <span style={{ color: '#d1d7db', fontSize: '17px' }}>+54 9 11 3323-2995</span>
                        <Copy size={20} style={{ color: '#8696a0', cursor: 'pointer' }} />
                    </div>
                </div>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#8696a0'
            }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    backgroundColor: '#202c33',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <div style={{ fontSize: '50px' }}>👤</div>
                </div>
                <h1 style={{ fontSize: '32px', fontWeight: '300' }}>Perfil</h1>
            </div>
        </div>
    );
};

export default ProfileScreen;