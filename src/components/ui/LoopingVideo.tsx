"use client";

import { useEffect, useRef, useState } from 'react';

interface LoopingVideoProps {
    videoId: string;
    start?: number;
    end?: number;
    mobileScale?: number;
    desktopScale?: number;
}

export default function LoopingVideo({
    videoId,
    start = 25,
    end = 50,
    mobileScale = 2.0,
    desktopScale = 2.2
}: LoopingVideoProps) {
    const playerRef = useRef<any>(null);
    const containerId = useRef(`yt-player-${Math.random().toString(36).substr(2, 9)}`);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        let isMounted = true;

        const initPlayer = () => {
            if (typeof window !== 'undefined' && (window as any).YT && (window as any).YT.Player) {
                if (!document.getElementById(containerId.current)) return;

                playerRef.current = new (window as any).YT.Player(containerId.current, {
                    videoId,
                    playerVars: {
                        autoplay: 1,
                        mute: 1,
                        controls: 0,
                        disablekb: 1,
                        fs: 0,
                        modestbranding: 1,
                        playsinline: 1,
                        rel: 0,
                        showinfo: 0,
                        start,
                        end,
                        enablejsapi: 1,
                        origin: typeof window !== 'undefined' ? window.location.origin : '',
                        iv_load_policy: 3,
                    },
                    events: {
                        onReady: (event: any) => {
                            if (!isMounted) return;
                            event.target.mute();
                            event.target.playVideo();
                        },
                        onStateChange: (event: any) => {
                            if (!isMounted) return;
                            // Reset when ended (0) or if it reaches very close to the end
                            if (event.data === (window as any).YT.PlayerState.ENDED) {
                                event.target.seekTo(start);
                                event.target.playVideo();
                            }
                        }
                    }
                });
            } else {
                setTimeout(initPlayer, 200);
            }
        };

        // Load API script if not present
        if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }

        const timer = setTimeout(initPlayer, 300);

        return () => {
            isMounted = false;
            clearTimeout(timer);
            if (playerRef.current && playerRef.current.destroy) {
                try {
                    playerRef.current.destroy();
                } catch (e) {
                    // Ignore destroy errors on unmount
                }
            }
        };
    }, [videoId, start, end]);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none bg-slate-900">
            <div
                id={containerId.current}
                className="w-full h-full"
                style={{
                    transform: `scale(${isMobile ? mobileScale : desktopScale})`,
                    transformOrigin: 'center center'
                }}
            />
        </div>
    );
}
