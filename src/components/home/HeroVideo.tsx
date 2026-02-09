"use client";

import { useEffect, useRef } from 'react';

export default function HeroVideo() {
    const playerRef = useRef<any>(null);

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
                        loop: 0, // Manual loop via onStateChange
                        modestbranding: 1,
                        playsinline: 1,
                        rel: 0,
                        showinfo: 0,
                        start: 25,
                        end: 50,
                    },
                    events: {
                        onReady: (event: any) => {
                            event.target.mute();
                            event.target.playVideo();
                        },
                        onStateChange: (event: any) => {
                            // YT.PlayerState.ENDED = 0
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
        <div className="w-full h-full overflow-hidden absolute inset-0">
            <div
                id="youtube-player"
                className="w-full h-full object-cover scale-[2] sm:scale-150 pointer-events-none opacity-90"
            />
        </div>
    );
}
