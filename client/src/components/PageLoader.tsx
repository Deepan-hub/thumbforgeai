import { useEffect, useState } from 'react';

export default function PageLoader() {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setFadeOut(true), 1800);
        const hideTimer = setTimeout(() => setVisible(false), 2300);
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: '#0d0800',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: fadeOut ? 0 : 1,
            transition: 'opacity 0.5s ease',
            pointerEvents: fadeOut ? 'none' : 'all',
        }}>
            <style>{`
                @keyframes neon-glow {
                    0%, 100% { filter: drop-shadow(0 0 4px #F97316) drop-shadow(0 0 8px #F97316); }
                    30%      { filter: drop-shadow(0 0 16px #FBBF24) drop-shadow(0 0 32px #F97316) drop-shadow(0 0 48px #F97316); }
                    70%      { filter: none; }
                    75%      { filter: drop-shadow(0 0 6px #FBBF24); }
                }
                @keyframes draw-tri {
                    0%   { stroke-dashoffset: 300; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes fill-white {
                    0%, 70% { fill: transparent; }
                    100%    { fill: white; }
                }
                @keyframes fade-in-dot {
                    0%, 70% { opacity: 0; }
                    100%    { opacity: 1; }
                }
                @keyframes dot-orange {
                    0%, 100% { fill: white; }
                    50%      { fill: #F97316; }
                }
                @keyframes dot-amber {
                    0%, 100% { fill: white; }
                    50%      { fill: #FBBF24; }
                }
            `}</style>

            <div style={{ animation: 'neon-glow 2s ease-in-out infinite' }}>
                <svg width="110" height="110" viewBox="-15 -15 94 94">
                    <polygon
                        points="4,60 32,4 60,60"
                        fill="transparent"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinejoin="round"
                        strokeDasharray="300"
                        style={{ animation: 'draw-tri 1.2s ease forwards, fill-white 1.2s ease forwards', strokeDashoffset: 300 }}
                    />
                    <polygon
                        points="20,52 32,28 44,52"
                        fill="#0d0800"
                        style={{ opacity: 0, animation: 'fade-in-dot 1.2s ease forwards' }}
                    />
                    <circle cx="4"  cy="60" r="4" style={{ opacity: 0, animation: 'fade-in-dot 0.3s ease 1s forwards, dot-orange 2s ease-in-out 1.3s infinite' }} />
                    <circle cx="60" cy="60" r="4" style={{ opacity: 0, animation: 'fade-in-dot 0.3s ease 1.1s forwards, dot-orange 2s ease-in-out 1.5s infinite' }} />
                    <circle cx="32" cy="4"  r="4" style={{ opacity: 0, animation: 'fade-in-dot 0.3s ease 1.2s forwards, dot-amber 2s ease-in-out 1.7s infinite' }} />
                </svg>
            </div>
        </div>
    );
}
