import React from 'react';

interface DefaultNoImageProps {
    text?: string;
    className?: string;
}

export default function DefaultNoImage({ text = 'NO IMAGE', className = '' }: DefaultNoImageProps) {
    return (
        <div className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-dark/90 to-asset-facility/90 ${className}`}>
            {/* 美しい幾何学パターン（ピックルボールボールのメタファー） */}
            <div className="absolute inset-0 opacity-10 mix-blend-overlay">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    <defs>
                        <pattern id="pickleball-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                            <circle cx="30" cy="30" r="12" fill="currentColor" />
                            <circle cx="24" cy="24" r="2" fill="#fff" />
                            <circle cx="36" cy="24" r="2" fill="#fff" />
                            <circle cx="30" cy="36" r="2" fill="#fff" />
                            <circle cx="20" cy="32" r="1.5" fill="#fff" />
                            <circle cx="40" cy="32" r="1.5" fill="#fff" />
                            <circle cx="30" cy="18" r="1.5" fill="#fff" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#pickleball-pattern)" className="text-brand-accent" />
                </svg>
            </div>

            {/* 中央のふんわりした光のエフェクト */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-brand-accent/20 rounded-full blur-3xl"></div>

            {/* テキストコンテンツ */}
            <div className="relative z-10 flex flex-col items-center gap-2 px-4 py-2 bg-black/20 rounded-xl backdrop-blur-sm border border-white/5">
                <span className="material-symbols-outlined text-3xl text-white/50">landscape</span>
                <span className="text-white/60 font-bold tracking-[0.2em] text-xs uppercase">{text}</span>
            </div>
        </div>
    );
}
