import React, { useState, useEffect } from 'react';
import '../../styles/App.css';

const LoadingScreen = ({ onFinished }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 9000;
        const intervalTime = 50;
        const increment = 100 / (duration / intervalTime);

        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    setTimeout(onFinished, 300);
                    return 100;
                }
                return oldProgress + increment;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [onFinished]);

    return (
        <div className="loading-screen">
            <div className="loading-content">
                {/* Logo 500x500 */}
                <div className="logo-container-fill">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                        alt="WA Gray"
                        className="logo-bg"
                    />
                    <div
                        className="logo-fill-mask"
                        style={{ height: `${progress}%` }}
                    >
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                            alt="WA Green"
                            className="logo-fg"
                        />
                    </div>
                </div>

                {/* Contenedor de carga */}
                <div className="loading-bar-wrapper">
                    <p className="loading-text">Instalando WhatsApp de Cracks...</p>
                    <div className="progress-bar-base">
                        <div
                            className="progress-fill-active"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <div className="percentage-container">
                        <span className="percentage-display">{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;