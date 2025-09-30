import React from 'react';

interface CountdownProps {
    count: number;
}

export const Countdown: React.FC<CountdownProps> = ({ count }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center pointer-events-none z-50">
            <div key={count} className="text-9xl font-bold text-white animate-ping-pong">
                {count}
            </div>
            <style>{`
                @keyframes ping-pong {
                    0% { transform: scale(0.5); opacity: 0; }
                    50% { transform: scale(1.2); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-ping-pong {
                    animation: ping-pong 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
