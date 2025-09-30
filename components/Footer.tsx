import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="text-center py-6 mt-8">
            <p className="text-gray-500 text-sm">
                Special Thanks To{' '}
                <a
                    href="https://toshikinunokawa.com/online-salon/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                >
                    Toshiki Nunokawa Online Salon
                </a>
            </p>
        </footer>
    );
};
