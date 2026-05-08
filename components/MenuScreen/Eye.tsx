"use client";

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Ref } from 'react';

export interface EyeHandle {
    /** The root container div for GSAP targeting. */
    eyeContainer: HTMLDivElement | null;
    /** The pupil <g> element for GSAP targeting. */
    pupil: SVGGElement | null;
    /** The iris <circle> element for GSAP targeting. */
    iris: SVGCircleElement | null;
    /** Starts the zero-latency cursor tracking. */
    startTracking: () => void;
}

interface EyeProps {
    /** Callback fired when Phase 2 (the tweak) finishes and the pupil settles. */
    onTweakComplete?: () => void;
}

const Eye = forwardRef(function Eye(
    { onTweakComplete }: EyeProps,
    ref: Ref<EyeHandle>
) {
    const eyeContainerRef = useRef<HTMLDivElement>(null);
    const pupilRef = useRef<SVGGElement>(null);
    const irisRef = useRef<SVGCircleElement>(null);
    const trackingListenerRef = useRef<((e: MouseEvent) => void) | null>(null);

    const startTracking = () => {
        if (!eyeContainerRef.current || !pupilRef.current) return;

        const xTo = gsap.quickTo(pupilRef.current, "x", { duration: 0.12, ease: "power3.out" });
        const yTo = gsap.quickTo(pupilRef.current, "y", { duration: 0.12, ease: "power3.out" });

        const listener = (e: MouseEvent) => {
            if (!eyeContainerRef.current) return;
            const rect = eyeContainerRef.current.getBoundingClientRect();
            const eyeCX = rect.left + rect.width / 2;
            const eyeCY = rect.top + rect.height / 2;
            const angle = Math.atan2(e.clientY - eyeCY, e.clientX - eyeCX);
            const dist = Math.min(
                8, // max pupil travel in pixels
                Math.hypot(e.clientX - eyeCX, e.clientY - eyeCY) * 0.08
            );
            xTo(Math.cos(angle) * dist);
            yTo(Math.sin(angle) * dist);
        };

        trackingListenerRef.current = listener;
        window.addEventListener('mousemove', listener);
    };

    useImperativeHandle(ref, () => ({
        get eyeContainer() { return eyeContainerRef.current; },
        get pupil() { return pupilRef.current; },
        get iris() { return irisRef.current; },
        startTracking,
    }));

    useGSAP(() => {
        if (!eyeContainerRef.current || !pupilRef.current || !irisRef.current) return;

        // Initialize state completely hidden and non-interactive before entrance
        gsap.set(eyeContainerRef.current, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0, pointerEvents: 'none' });

        const tl = gsap.timeline({
            paused: true,
            delay: 1.2,
            onComplete: () => {
                onTweakComplete?.();
            }
        });

        // Phase 1 — "Appear from the void"
        tl.fromTo(eyeContainerRef.current,
            { opacity: 0, scale: 0, rotation: -15 },
            { opacity: 1, scale: 1, rotation: 0,
              duration: 0.5, ease: "back.out(2.2)",
              onStart: () => {
                gsap.set(eyeContainerRef.current, { pointerEvents: 'auto' });
              }
            }
        )
        // Phase 2 — The TWEAK: pupil darts frantically
        .add("dartStart")
        .to(eyeContainerRef.current, {
            keyframes: [
              { x: -3, y: 2,  duration: 0.08 },
              { x: 4,  y: -3, duration: 0.08 },
              { x: -2, y: 4,  duration: 0.08 },
              { x: 3,  y: -2, duration: 0.08 },
              { x: 0,  y: 0,  duration: 0.15 },
            ]
        }, "dartStart")
        .to(pupilRef.current, { x: -18, y: 6,   duration: 0.08, ease: "power4.inOut" }, "dartStart")
        .to(pupilRef.current, { x: 20,  y: -10, duration: 0.07, ease: "power4.inOut" })
        .to(pupilRef.current, { x: -12, y: -18, duration: 0.09, ease: "power4.inOut" })
        .to(pupilRef.current, { x: 16,  y: 14,  duration: 0.07, ease: "power4.inOut" })
        .to(pupilRef.current, { x: -20, y: 3,   duration: 0.08, ease: "power4.inOut" })
        .to(pupilRef.current, { x: 8,   y: -19, duration: 0.06, ease: "power4.inOut" })
        .to(pupilRef.current, { x: 19,  y: 18,  duration: 0.08, ease: "power4.inOut" })
        .to(pupilRef.current, { x: -15, y: -12, duration: 0.07, ease: "power4.inOut" })
        .to(pupilRef.current, { x: 20,  y: -4,  duration: 0.06, ease: "power4.inOut" })
        .to(pupilRef.current, { x: -18, y: 16,  duration: 0.09, ease: "power4.inOut" })
        .to(pupilRef.current, { x: 10,  y: 20,  duration: 0.07, ease: "power4.inOut" })
        .to(pupilRef.current, { x: -20, y: -8,  duration: 0.08, ease: "power4.inOut" })
        .to(pupilRef.current, { x: 14,  y: -16, duration: 0.06, ease: "power4.inOut" })
        .to(pupilRef.current, { x: -6,  y: 18,  duration: 0.09, ease: "power4.inOut" })
        // Slow realisation — it's found its target
        .to(pupilRef.current, { x: 0, y: 0, duration: 0.35, ease: "elastic.out(1.2, 0.35)" })
        // Beat of stillness before the parent takes over
        .to({}, { duration: 0.25 });

        // Trigger animation on custom event dispatched by HeroScene scroll
        const triggerEyeAnimation = () => tl.play();
        window.addEventListener('startMenuTransition', triggerEyeAnimation);

        return () => {
            window.removeEventListener('startMenuTransition', triggerEyeAnimation);
            if (trackingListenerRef.current) {
                window.removeEventListener('mousemove', trackingListenerRef.current);
            }
        };
    }, { scope: eyeContainerRef });

    return (
        <div
            ref={eyeContainerRef}
            style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                width: '200px',
                height: '200px',
                zIndex: 50,
            }}
        >
            <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                    <radialGradient id="irisGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#ff2222" />
                        <stop offset="50%" stopColor="#8b0000" />
                        <stop offset="100%" stopColor="#1a0000" />
                    </radialGradient>
                    <radialGradient id="casingGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#1a1a1a" />
                        <stop offset="100%" stopColor="#050505" />
                    </radialGradient>
                    <radialGradient id="pupilGrad" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#000000" />
                        <stop offset="100%" stopColor="#0d0000" />
                    </radialGradient>
                    <filter id="eyeGlow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="in" />
                    </filter>
                    <filter id="softGlow">
                        <feGaussianBlur stdDeviation="6" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Layer 1 — Outer ambient glow ring */}
                <circle cx="60" cy="60" r="52" fill="#8b000015" filter="url(#softGlow)" />
                {/* Layer 2 — Metallic outer casing */}
                <circle cx="60" cy="60" r="48" fill="url(#casingGrad)" stroke="#2a0505" strokeWidth="1.5" />
                {/* Layer 3 — Casing inner bevel */}
                <circle cx="60" cy="60" r="44" fill="none" stroke="#3d0a0a" strokeWidth="1" />
                {/* Layer 4 — Iris */}
                <circle ref={irisRef} cx="60" cy="60" r="36" fill="url(#irisGrad)" filter="url(#eyeGlow)" />
                {/* Layer 5 — Iris detail ring */}
                <circle cx="60" cy="60" r="28" fill="none" stroke="#ff000020" strokeWidth="1.5" />

                {/* Layer 8 — Outer mechanical tick marks */}
                {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i * 45 * Math.PI) / 180;
                    const x1 = 60 + Math.cos(angle) * 49;
                    const y1 = 60 + Math.sin(angle) * 49;
                    const x2 = 60 + Math.cos(angle) * 52;
                    const y2 = 60 + Math.sin(angle) * 52;
                    return (
                        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3d0a0a" strokeWidth="1" />
                    );
                })}

                {/* Layer 6 — Pupil group */}
                <g ref={pupilRef}>
                    <circle cx="60" cy="60" r="14" fill="url(#pupilGrad)" />
                    {/* Layer 7 — Corneal highlight */}
                    <ellipse cx="54" cy="54" rx="5" ry="3" fill="rgba(255,255,255,0.18)" />
                </g>
            </svg>
        </div>
    );
});

export default Eye;
