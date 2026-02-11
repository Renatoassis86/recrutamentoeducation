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

                        modestbranding: 1,
                        playsinline: 1, // Critical for mobile
                        rel: 0,
                        showinfo: 0,
                        start: 30,
                        end: 55,
                        enablejsapi: 1,
                        origin: typeof window !== 'undefined' ? window.location.origin : '',
                        iv_load_policy: 3, // Hide annotations
                        cc_load_policy: 0, // Default caps off
                        hl: 'pt-BR', // Force language interface
                    },
                    events: {
                        onReady: (event: any) => {
                            event.target.mute(); // Ensure muted again
                            if (event.target.hideTextTrack) {
                                // Try to hide captions strictly
                                // Note: This isn't a standard API method but some players expose similar tracks
                            }
                            event.target.playVideo();
                        },
                        onStateChange: (event: any) => {
                            // YT.PlayerState.ENDED = 0
                            // Strict loop: Reload video with start/end constraints
                            if (event.data === 0) {
                                event.target.loadVideoById({
                                    videoId: 'gU00NwWoG8w',
                                    startSeconds: 30,
                                    endSeconds: 55
                                });
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
        <div className="w-full h-full overflow-hidden absolute inset-0 pointer-events-none bg-slate-900">
            <div
                id="youtube-player"
                className="w-full h-full object-cover sm:scale-[2.2] scale-[2.0] opacity-90 transition-opacity duration-1000"
            />
            {/* Mobile Fallback Overlay */}
            <div className={`absolute inset-0 bg-slate-900 z-[-1] transition-opacity duration-500`} />
        </div>
    );
}
