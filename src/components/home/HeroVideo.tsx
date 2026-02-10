"use client";

import { useEffect, useRef, useState } from 'react';

export default function HeroVideo() {
    const playerRef = useRef<any>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        // Function to initialize the player
        const initPlayer = () => {
            // Check if YT API is ready
            if (typeof window !== 'undefined' && (window as any).YT && (window as any).YT.Player) {
                playerRef.current = new (window as any).YT.Player('youtube-player', {
                    videoId: 'gU00NwWoG8w',
                    playerVars: {
                        autoplay: 1,
                        mute: 1,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        loop: 1, // Enable native loop
                        playlist: 'gU00NwWoG8w', // Required for native loop to work
                        modestbranding: 1,
                        playsinline: 1, // Critical for mobile
                        rel: 0,
                        showinfo: 0,
                        start: 25,
                        end: 50,
                        enablejsapi: 1,
                        origin: typeof window !== 'undefined' ? window.location.origin : 'https://recrutamentoeducation.vercel.app',
                    },
                    events: {
                        onReady: (event: any) => {
                            event.target.mute(); // Ensure muted again for mobile
                            event.target.playVideo();
                        },
                        onStateChange: (event: any) => {
                            // YT.PlayerState.ENDED = 0
                            // Manual loop fallback if native loop fails
                            if (event.data === 0) {
                                event.target.seekTo(25);
                                event.target.playVideo();
                            }
                        }
                    }
                });
            } else {
                // Retry shortly if API script loaded but YT object not ready yet
                setTimeout(initPlayer, 100);
            }
        };

        // Check if script is already in DOM
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag && firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            } else {
                document.head.appendChild(tag);
            }
        }

        // Attempt initialization
        const timer = setTimeout(initPlayer, 500);

        return () => {
            clearTimeout(timer);
            if (playerRef.current) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    console.error("Error destroying YT player", e);
                }
            }
        };
    }, []);

    return (
        <div className="w-full h-full overflow-hidden absolute inset-0 pointer-events-none">
            <div
                id="youtube-player"
                className="w-full h-full object-cover scale-[2] sm:scale-150 opacity-90"
            />
            {/* Mobile Fallback Overlay (Optional, acts as poster if video fails to autoplay) */}
            <div className={`absolute inset-0 bg-slate-900 z-[-1] ${isMobile ? 'block' : 'hidden'}`} />
        </div>
    );
}
