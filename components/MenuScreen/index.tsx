"use client";

import React, { useRef, useCallback, useState, useEffect } from 'react';
import gsap from 'gsap';
import { Cinzel } from 'next/font/google';
import Eye from './Eye';
import EyeHub from './EyeHub';
import type { EyeHandle } from './Eye';
import type { EyeHubHandle } from './EyeHub';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

// ============================================================================
// 🎯 MASTER SYSTEM CONTROLS
// ============================================================================
const COMPASS_X      = 25;
const COMPASS_Y      = -5;
const COMPASS_RADIUS = 350;
const EYE_SOCKET_X   = 90;
const EYE_SOCKET_Y   = 165;
// ============================================================================

const RADAR_LINES = [ -10.0, -25.00, -40.00, -53.00, -67.00, -78.5 ];

const BLADES = [
    { id: 'contact',    title: 'CONTACT',    baseAngle: -17.5,  spread: 15.0, color: '#2a9d8f', bg: '/contact-bg.png'    },
    { id: 'experience', title: 'EXPERIENCE', baseAngle: -32.5,  spread: 15.0, color: '#8b6914', bg: '/experience-bg.png' },
    { id: 'projects',   title: 'PROJECTS',   baseAngle: -46.5,  spread: 13.0, color: '#cc2222', bg: '/projects-bg.png'   },
    { id: 'skills',     title: 'SKILLS',     baseAngle: -60.0,  spread: 14.0, color: '#5577bb', bg: '/skills-bg.png'     },
    { id: 'about',      title: 'ABOUT',      baseAngle: -72.75, spread: 11.5, color: '#c8a84b', bg: '/about-bg.png'      },
];

// ── NEW: Hardcoded ember data (fixed values = no SSR hydration mismatch) ──────
// left: horizontal position | size: dot diameter | dur: rise duration
// delay: stagger start | drift: horizontal sway | color: crimson or ember-orange
const EMBERS = [
    { id:  0, left: '6%',  size: '1.5px', dur: '12s', delay: '0s',    drift:  '22px',  color: '#cc1111' },
    { id:  1, left: '14%', size: '2px',   dur: '9s',  delay: '1.8s',  drift: '-18px',  color: '#ff4422' },
    { id:  2, left: '23%', size: '1px',   dur: '14s', delay: '0.4s',  drift:  '35px',  color: '#cc1111' },
    { id:  3, left: '31%', size: '2px',   dur: '10s', delay: '3.2s',  drift: '-28px',  color: '#cc1111' },
    { id:  4, left: '40%', size: '1.5px', dur: '11s', delay: '0.9s',  drift:  '15px',  color: '#ff4422' },
    { id:  5, left: '49%', size: '1px',   dur: '13s', delay: '5.1s',  drift: '-40px',  color: '#cc1111' },
    { id:  6, left: '57%', size: '2px',   dur: '8s',  delay: '2.2s',  drift:  '28px',  color: '#ff4422' },
    { id:  7, left: '63%', size: '1.5px', dur: '15s', delay: '0.6s',  drift: '-12px',  color: '#cc1111' },
    { id:  8, left: '71%', size: '1px',   dur: '10s', delay: '4.4s',  drift:  '32px',  color: '#ff4422' },
    { id:  9, left: '78%', size: '2px',   dur: '12s', delay: '1.3s',  drift: '-25px',  color: '#cc1111' },
    { id: 10, left: '84%', size: '1.5px', dur: '9s',  delay: '6.0s',  drift:  '18px',  color: '#ff4422' },
    { id: 11, left: '89%', size: '1px',   dur: '11s', delay: '2.7s',  drift: '-30px',  color: '#cc1111' },
    { id: 12, left: '93%', size: '2px',   dur: '13s', delay: '0.2s',  drift:  '20px',  color: '#ff4422' },
    { id: 13, left: '19%', size: '1px',   dur: '16s', delay: '7.5s',  drift: '-15px',  color: '#cc1111' },
    { id: 14, left: '52%', size: '1.5px', dur: '10s', delay: '3.8s',  drift:  '38px',  color: '#ff4422' },
    { id: 15, left: '10%', size: '1px',   dur: '11s', delay: '4.2s',  drift: '-20px',  color: '#cc1111' },
    { id: 16, left: '35%', size: '2px',   dur: '14s', delay: '8.5s',  drift:  '15px',  color: '#ff4422' },
    { id: 17, left: '68%', size: '1.5px', dur: '9s',  delay: '1.1s',  drift: '-30px',  color: '#cc1111' },
    { id: 18, left: '82%', size: '2px',   dur: '15s', delay: '6.7s',  drift:  '40px',  color: '#ff4422' },
    { id: 19, left: '96%', size: '1px',   dur: '12s', delay: '2.9s',  drift: '-10px',  color: '#cc1111' },
    { id: 20, left: '22%', size: '1px',   dur: '13s', delay: '5.8s',  drift: '-22px',  color: '#cc1111' },
    { id: 21, left: '75%', size: '2px',   dur: '8s',  delay: '3.1s',  drift:  '35px',  color: '#ff4422' },
    { id: 22, left: '38%', size: '1.5px', dur: '10s', delay: '1.9s',  drift: '-12px',  color: '#cc1111' },
    { id: 23, left: '60%', size: '1px',   dur: '14s', delay: '7.3s',  drift:  '25px',  color: '#ff4422' },
    { id: 24, left: '87%', size: '2px',   dur: '11s', delay: '4.0s',  drift: '-32px',  color: '#cc1111' },
    { id: 25, left: '14%', size: '1.5px', dur: '9s',  delay: '6.4s',  drift:  '18px',  color: '#ff4422' },
    { id: 26, left: '28%', size: '1px',   dur: '12s', delay: '2.3s',  drift: '-28px',  color: '#cc1111' },
    { id: 27, left: '54%', size: '2px',   dur: '10s', delay: '0.5s',  drift:  '40px',  color: '#ff4422' },
    { id: 28, left: '73%', size: '1.5px', dur: '13s', delay: '3.6s',  drift: '-15px',  color: '#cc1111' },
    { id: 29, left: '6%',  size: '1px',   dur: '15s', delay: '8.1s',  drift:  '22px',  color: '#ff4422' },
    { id: 30, left: '41%', size: '2px',   dur: '9s',  delay: '1.4s',  drift: '-26px',  color: '#cc1111' },
    { id: 31, left: '66%', size: '1.5px', dur: '11s', delay: '5.2s',  drift:  '35px',  color: '#ff4422' },
    { id: 32, left: '88%', size: '1px',   dur: '13s', delay: '7.0s',  drift: '-12px',  color: '#cc1111' },
    { id: 33, left: '18%', size: '2px',   dur: '10s', delay: '3.4s',  drift:  '18px',  color: '#ff4422' },
    { id: 34, left: '52%', size: '1.5px', dur: '12s', delay: '1.7s',  drift: '-30px',  color: '#cc1111' },
    { id: 35, left: '81%', size: '1px',   dur: '8s',  delay: '4.5s',  drift:  '20px',  color: '#ff4422' },
    { id: 36, left: '95%', size: '2px',   dur: '14s', delay: '0.8s',  drift: '-25px',  color: '#cc1111' },
    { id: 37, left: '32%', size: '1.5px', dur: '11s', delay: '6.2s',  drift:  '38px',  color: '#ff4422' },
    { id: 38, left: '65%', size: '1px',   dur: '9s',  delay: '2.8s',  drift: '-15px',  color: '#cc1111' },
    { id: 39, left: '12%', size: '2px',   dur: '13s', delay: '7.6s',  drift:  '30px',  color: '#ff4422' },
    { id: 40, left: '46%', size: '1.5px', dur: '10s', delay: '4.1s',  drift: '-18px',  color: '#cc1111' },
    { id: 41, left: '80%', size: '2px',   dur: '12s', delay: '0.3s',  drift:  '22px',  color: '#ff4422' },
    { id: 42, left: '27%', size: '1px',   dur: '11s', delay: '5.5s',  drift: '-32px',  color: '#cc1111' },
    { id: 43, left: '61%', size: '1.5px', dur: '15s', delay: '1.6s',  drift:  '28px',  color: '#ff4422' },
    { id: 44, left: '84%', size: '2px',   dur: '9s',  delay: '6.8s',  drift: '-10px',  color: '#cc1111' },
    { id: 45, left: '5%',  size: '1px',   dur: '13s', delay: '3.2s',  drift:  '40px',  color: '#ff4422' },
    { id: 46, left: '39%', size: '1.5px', dur: '11s', delay: '8.0s',  drift: '-20px',  color: '#cc1111' },
    { id: 47, left: '71%', size: '2px',   dur: '10s', delay: '1.2s',  drift:  '15px',  color: '#ff4422' },
    { id: 48, left: '17%', size: '1px',   dur: '14s', delay: '4.7s',  drift: '-25px',  color: '#cc1111' },
    { id: 49, left: '55%', size: '1.5px', dur: '9s',  delay: '0.4s',  drift:  '35px',  color: '#ff4422' },
    { id: 50, left: '21%', size: '2px',   dur: '12s', delay: '6.5s',  drift: '-18px',  color: '#cc1111' },
    { id: 51, left: '77%', size: '1px',   dur: '13s', delay: '2.1s',  drift:  '28px',  color: '#ff4422' },
    { id: 52, left: '91%', size: '2px',   dur: '8s',  delay: '7.8s',  drift: '-12px',  color: '#cc1111' },
    { id: 53, left: '34%', size: '1.5px', dur: '10s', delay: '3.9s',  drift:  '20px',  color: '#ff4422' },
    { id: 54, left: '68%', size: '1px',   dur: '11s', delay: '1.3s',  drift: '-32px',  color: '#cc1111' },
    { id: 55, left: '10%', size: '2px',   dur: '15s', delay: '8.2s',  drift:  '25px',  color: '#ff4422' },
    { id: 56, left: '48%', size: '1.5px', dur: '9s',  delay: '4.6s',  drift: '-15px',  color: '#cc1111' },
    { id: 57, left: '85%', size: '1px',   dur: '12s', delay: '2.5s',  drift:  '30px',  color: '#ff4422' },
    { id: 58, left: '24%', size: '2px',   dur: '10s', delay: '6.9s',  drift: '-28px',  color: '#cc1111' },
    { id: 59, left: '59%', size: '1.5px', dur: '13s', delay: '1.0s',  drift:  '40px',  color: '#ff4422' },
    { id: 60, left: '3%',  size: '1px',   dur: '11s', delay: '5.3s',  drift: '-18px',  color: '#cc1111' },
    { id: 61, left: '42%', size: '2px',   dur: '14s', delay: '0.7s',  drift:  '32px',  color: '#ff4422' },
    { id: 62, left: '76%', size: '1.5px', dur: '9s',  delay: '7.2s',  drift: '-10px',  color: '#cc1111' },
    { id: 63, left: '89%', size: '1px',   dur: '12s', delay: '3.0s',  drift:  '20px',  color: '#ff4422' },
];

export default function MenuScreen() {
    const eyeRef        = useRef<EyeHandle>(null);
    const eyeHubRef     = useRef<EyeHubHandle>(null);
    const bloodBgRef    = useRef<HTMLDivElement>(null);
    const menuSpikesRef = useRef<HTMLDivElement>(null);
    const gridRef       = useRef<HTMLDivElement>(null);
    const statsRef      = useRef<HTMLDivElement>(null);
    const embersRef     = useRef<HTMLDivElement>(null);
    const colorWipeRef  = useRef<HTMLDivElement>(null);
    const blackWipeRef  = useRef<HTMLDivElement>(null);

    const [hoverIndex, setHoverIndex]   = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [wipeColor, setWipeColor] = useState('#000000');

    const textRefs  = useRef<(HTMLHeadingElement | null)[]>([]);
    const bgRefs    = useRef<(HTMLDivElement | null)[]>([]);
    const glowRefs  = useRef<(HTMLDivElement | null)[]>([]);
    

    if (textRefs.current.length === 0) {
        textRefs.current  = Array(BLADES.length).fill(null);
        bgRefs.current    = Array(BLADES.length).fill(null);
        glowRefs.current  = Array(BLADES.length).fill(null);
    }

    const handleTweakComplete = useCallback(() => {
        const eye        = eyeRef.current;
        const hub        = eyeHubRef.current;
        const bloodBg    = bloodBgRef.current;
        const menuSpikes = menuSpikesRef.current;
        const grid       = gridRef.current;
        const stats      = statsRef.current;
        const embers     = embersRef.current; // ← NEW

        if (!eye?.eyeContainer || !eye?.pupil || !eye?.iris || !hub?.container || !bloodBg || !menuSpikes || !grid || !stats || !embers) return;

        gsap.set(hub.container, { opacity: 0, x: -100, y: 150, scale: 1.5, transformOrigin: "bottom left" });

        const masterTl = gsap.timeline();

        masterTl
        .to(hub.container, { opacity: 1, x: 0, y: 0, duration: 1.5, ease: "expo.out" }, "start")
        .to(eye.pupil, { x: -24, y: 24, duration: 0.3, ease: "power3.out" }, "start+=0.1")

        .add("tugOfWar", "+=0.1")
        .to(eye.eyeContainer, { top: '35%', left: '65%', scale: 0.85, rotation: 15, duration: 0.4, ease: "power2.out" }, "tugOfWar")
        .to(eye.eyeContainer, {
            keyframes: [
                { top: '45%', left: '50%', scale: 0.75, duration: 0.35, ease: "power2.in" },
                { top: '38%', left: '58%', scale: 0.8,  duration: 0.15, ease: "expo.out" },
                { top: '65%', left: '30%', scale: 0.65, duration: 0.4,  ease: "power2.in" },
                { top: '55%', left: '40%', scale: 0.7,  duration: 0.15, ease: "expo.out" },
                { top: '75%', left: '20%', scale: 0.55, duration: 0.4,  ease: "power2.in" },
            ]
        }, "tugOfWar+=0.4")
        .to(eye.eyeContainer, { x: 6, y: -6, duration: 0.04, yoyo: true, repeat: 35, ease: "sine.inOut" }, "tugOfWar+=0.4")

        .add("surge")
        .to(hub.container,    { scale: 1.6, filter: 'brightness(1.8)', duration: 0.3, ease: "power2.out" }, "surge")
        .to(eye.eyeContainer, { scale: 0.3, rotation: 35,              duration: 0.3, ease: "power2.out" }, "surge")

        .add("snap")
        .to(eye.eyeContainer, {
            position: 'fixed', top: `calc(100vh - ${EYE_SOCKET_Y}px)`, left: `${EYE_SOCKET_X}px`,
            xPercent: 0, yPercent: 0, width: 140, height: 140, x: 0, y: 0, scale: 1, rotation: 0,
            duration: 0.15, ease: "expo.in"
        }, "snap")
        .to(eye.pupil, { x: 0, y: 0, duration: 0.1, ease: "expo.in" }, "snap")

        .add("impact", "snap+=0.15")
        .to(bloodBg, {
            clipPath: `circle(150vw at 0px 100vh)`,
            webkitClipPath: `circle(150vw at 0px 100vh)`,
            duration: 1.6, ease: "power3.out"
        }, "impact")
        .to(grid,        { opacity: 1, duration: 1.0, ease: "power2.out" }, "impact+=0.1")
        .to(menuSpikes,  { opacity: 1, duration: 1.0, ease: "power2.out" }, "impact+=0.2")
        .to(stats,       { opacity: 1, duration: 1.0, ease: "power2.out" }, "impact+=0.2")

        // ── NEW: embers fade in gently after the flood settles ────────────
        .to(embers, { opacity: 1, duration: 2.0, ease: "power2.out" }, "impact+=0.8")

        // ── NEW: blood background breathing — bloodBg only, infinite loop ─
        .add(() => {
            gsap.to(bloodBg, {
                scale: 1.012,
                duration: 5,
                ease: "sine.inOut",
                yoyo: true,
                repeat: -1,
                transformOrigin: 'center center',
            });
        }, "impact+=1.2")

        .to(hub.container, { scale: 1.5, filter: 'brightness(1)', duration: 0.5, ease: "power3.out" }, "impact")
        .to(hub.container, { x: -15, y: 15,  duration: 0.04, ease: "sine.inOut" }, "impact")
        .to(hub.container, { x: 10,  y: -10, duration: 0.05, ease: "sine.inOut" }, "impact+=0.04")
        .to(hub.container, { x: -6,  y: 6,   duration: 0.06, ease: "sine.inOut" }, "impact+=0.09")
        .to(hub.container, { x: 0,   y: 0,   duration: 0.1,  ease: "sine.out"   }, "impact+=0.15")
        .to(eye.iris, { filter: 'brightness(4)', duration: 0.05, ease: "expo.out", yoyo: true, repeat: 1 }, "impact")
        .add(() => eye.startTracking(), "impact+=0.2");

    }, []);

    // 🚀 THE EXIT ENGINE (UNIFIED SLASH WIPE)
    const handleRouteTransition = (i: number, blade: any) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        setActiveIndex(i);
        setWipeColor(blade.color); 

        console.log(`🔪 INITIALIZING SLASH WIPE FOR: ${blade.id}`);

        const tl = gsap.timeline({
            onComplete: () => {
                console.log(`🌑 BLACKOUT COMPLETE. DISPATCHING EVENT FOR: ${blade.id}`);
                window.dispatchEvent(new CustomEvent('menuBreach', { detail: blade.id }));
            }
        });

        tl.to(menuSpikesRef.current, { scale: 0.95, opacity: 0, duration: 0.4, ease: "power2.in" }, 0)
          .to(eyeHubRef.current?.container || null, { scale: 1.4, opacity: 0, duration: 0.4, ease: "power2.in" }, 0)
          .to(gridRef.current, { opacity: 0, duration: 0.3 }, 0)
          .to(statsRef.current, { opacity: 0, duration: 0.3 }, 0)
          .to(colorWipeRef.current, {
              clipPath: 'polygon(-20% -20%, 120% -20%, 100% 120%, -40% 120%)',
              WebkitClipPath: 'polygon(-20% -20%, 120% -20%, 100% 120%, -40% 120%)',
              duration: 0.6, ease: "expo.inOut"
          }, 0.2)
          .to(blackWipeRef.current, {
              clipPath: 'polygon(-20% -20%, 120% -20%, 100% 120%, -40% 120%)',
              WebkitClipPath: 'polygon(-20% -20%, 120% -20%, 100% 120%, -40% 120%)',
              duration: 0.6, ease: "expo.inOut"
          }, 0.35);
    };

    // NEW: Listen for the Back Button from Inner Pages
    // ↩️ THE RETURN ENGINE (BIFURCATED ROUTER)
    // ↩️ THE RETURN ENGINE (UNIFIED SLASH WIPE)
    useEffect(() => {
        const handleReturn = () => {
            console.log("↩️ EVENT CAUGHT IN MENU! PULLING BACK THE SHADOWS...");
            setIsTransitioning(false);
            
            // Retreat the slashes back into the bottom-right corner
            gsap.to([blackWipeRef.current, colorWipeRef.current], {
                clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)',
                WebkitClipPath: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)',
                duration: 0.8,
                ease: "expo.out",
                stagger: 0.1
            });
            
            // Bring the UI back
            gsap.to([menuSpikesRef.current, gridRef.current, statsRef.current], { 
                opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, delay: 0.3
            });
            gsap.to(eyeHubRef.current?.container, { 
                opacity: 1, scale: 1.5, filter: 'blur(0px)', duration: 0.5, delay: 0.3,
                onComplete: () => {
                    // Wipe the memory ONLY after the animation finishes!
                    setActiveIndex(null);
                    setHoverIndex(null);
                }
            });
        };

        window.addEventListener('returnToMenu', handleReturn);
        return () => window.removeEventListener('returnToMenu', handleReturn);
    }, [activeIndex]); // Added activeIndex to dependencies so it knows what page we are on

    useEffect(() => {
        if (!menuSpikesRef.current || isTransitioning) return;

        const activeTarget = activeIndex !== null ? activeIndex : hoverIndex;

        BLADES.forEach((blade, i) => {
            const text = textRefs.current[i];
            const bg   = bgRefs.current[i];
            const glow = glowRefs.current[i];
            if (!text || !bg || !glow) return;

            let textScale  = 1;
            let textX      = 0;
            let textColor  = "rgba(255, 255, 255, 0.4)";
            let textStroke = "0px transparent";
            let textShadow = "none";

            const IDLE_CLIP  = `polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)`;
            const HOVER_CLIP = `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)`;
            let textureClip  = IDLE_CLIP;

            if (activeTarget !== null) {
                if (i === activeTarget) {
                    textureClip = HOVER_CLIP;
                    textScale   = 1.1;
                    textX       = 25;
                    if (activeIndex === i) {
                        textColor  = "#ffffff";
                        textStroke = `1px ${blade.color}`;
                        textShadow = `0 0 20px ${blade.color}`;
                    } else {
                        textColor  = "transparent";
                        textStroke = `1px ${blade.color}`;
                        textShadow = "none";
                    }
                } else {
                    textColor = "rgba(255, 255, 255, 0.15)";
                }
            }

            gsap.to(text, { scale: textScale, x: textX, color: textColor, WebkitTextStroke: textStroke, textShadow, duration: 0.4, ease: "power2.out", overwrite: "auto" });
            gsap.to([bg, glow], { clipPath: textureClip, webkitClipPath: textureClip, duration: 0.85, ease: "power2.out", overwrite: "auto" });
        });

    }, [hoverIndex, activeIndex, isTransitioning]);

    return (
        <section
            id="menu-screen"
            className="fixed inset-0 bg-[#04010a] flex items-center justify-center overflow-hidden"
            style={{ zIndex: 5 }}
        >
            {/* ── NEW: Ember keyframes injected inline ─────────────────────── */}
            <style>{`
                @keyframes emberRise {
                    0%   { transform: translateY(0)      translateX(0);            opacity: 0;   }
                    8%   { opacity: 1;                                                            }
                    92%  { opacity: 0.55;                                                         }
                    100% { transform: translateY(-100vh) translateX(var(--ember-drift)); opacity: 0; }
                }
            `}</style>

            {/* BLOOD BACKGROUND */}
            <div
                ref={bloodBgRef}
                className="fixed inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: 'url("/blood-bg.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    clipPath: `circle(0px at 0px 100vh)`,
                    WebkitClipPath: `circle(0px at 0px 100vh)`,
                    maskImage: 'linear-gradient(to bottom, black 65%, transparent 86%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 86%)',
                }}
            />

            {/* ── NEW: Ember particles overlay ─────────────────────────────── */}
            <div
                ref={embersRef}
                className="fixed inset-0 z-[2] pointer-events-none opacity-0"
            >
                {EMBERS.map((e) => (
                    <div
                        key={e.id}
                        style={{
                            position: 'absolute',
                            bottom: '-4px',
                            left: e.left,
                            width: e.size,
                            height: e.size,
                            borderRadius: '50%',
                            backgroundColor: e.color,
                            boxShadow: `0 0 4px 1px ${e.color}88`,
                            ['--ember-drift' as string]: e.drift,
                            animation: `emberRise ${e.dur} ${e.delay} ease-in infinite`,
                        }}
                    />
                ))}
            </div>

            {/* DIEGETIC RADAR GRID — unchanged */}
            <div
                ref={gridRef}
                className="absolute z-[5] pointer-events-none opacity-0"
                style={{ bottom: `${COMPASS_Y}px`, left: `${COMPASS_X}px` }}
            >
                <div
                    className="absolute rounded-full border border-[#cc2222]/40 shadow-[0_0_15px_rgba(204,34,34,0.2)]"
                    style={{ width: COMPASS_RADIUS * 2, height: COMPASS_RADIUS * 2, left: -COMPASS_RADIUS, bottom: -COMPASS_RADIUS }}
                />
                {RADAR_LINES.map((angle, i) => (
                    <div
                        key={`line-${i}`}
                        className="absolute"
                        style={{ width: '3000px', height: '1px', left: '0px', bottom: '0px', transformOrigin: '0 50%', transform: `rotate(${angle}deg)` }}
                    >
                        <div style={{ position: 'absolute', left: `${COMPASS_RADIUS}px`, width: `calc(100% - ${COMPASS_RADIUS}px)`, height: '100%', background: 'linear-gradient(90deg, rgba(204,34,34,0.6) 0%, transparent 100%)' }} />
                    </div>
                ))}
            </div>

            {/* HUD WEDGES — unchanged */}
            <div
                ref={menuSpikesRef}
                className="opacity-0 absolute z-10 pointer-events-none"
                style={{ bottom: `${COMPASS_Y}px`, left: `${COMPASS_X}px`, width: 0, height: 0 }}
            >
                {BLADES.map((blade, i) => (
                    <div
                        key={blade.id}
                        className="absolute left-0 pointer-events-none"
                        style={{ bottom: '-1200px', width: '3000px', height: '2400px', transformOrigin: '0 50%', transform: `rotate(${blade.baseAngle}deg)` }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-auto cursor-pointer"
                            style={{
                                clipPath: `polygon(0 50%, 100% calc(50% - ${Math.tan((blade.spread / 2) * (Math.PI / 180)) * 3000}px), 100% calc(50% + ${Math.tan((blade.spread / 2) * (Math.PI / 180)) * 3000}px), 0 50%)`,
                                WebkitClipPath: `polygon(0 50%, 100% calc(50% - ${Math.tan((blade.spread / 2) * (Math.PI / 180)) * 3000}px), 100% calc(50% + ${Math.tan((blade.spread / 2) * (Math.PI / 180)) * 3000}px), 0 50%)`,
                            }}
                            onMouseEnter={() => setHoverIndex(i)}
                            onMouseLeave={() => setHoverIndex(null)}
                            onClick={() => handleRouteTransition(i, blade)}
                        >
                            <div
                                ref={(el: HTMLDivElement | null) => { bgRefs.current[i] = el; }}
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    backgroundImage: `url(${blade.bg})`,
                                    backgroundSize: '1000px',
                                    backgroundRepeat: 'repeat',
                                    backgroundPosition: 'left center',
                                    clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                                    WebkitClipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                                }}
                            />
                            <div
                                ref={(el: HTMLDivElement | null) => { glowRefs.current[i] = el; }}
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: `radial-gradient(circle at 0% 50%, ${blade.color}A0 0%, ${blade.color}00 60%)`,
                                    mixBlendMode: 'screen',
                                    clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                                    WebkitClipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                                }}
                            />
                        </div>
                        <h2
                            ref={(el: HTMLHeadingElement | null) => { textRefs.current[i] = el; }}
                            className="absolute font-serif uppercase tracking-[0.3em] text-white/50 whitespace-nowrap pointer-events-none drop-shadow-md"
                            style={{ fontSize: '42px', left: `${COMPASS_RADIUS + 40}px`, top: '50%', transform: 'translateY(-50%)', transformOrigin: 'left center' }}
                        >
                            {blade.title}
                        </h2>
                    </div>
                ))}
            </div>

            {/* STATS WIDGET */}
            <div
                ref={statsRef}
                className="fixed bottom-[3%] right-[3%] z-20 opacity-0 pointer-events-none flex items-end gap-6"
            >
                <div className="flex flex-col items-center gap-[3px]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                    <span className={`${cinzel.className} text-[1.25rem] font-bold text-white/70 leading-none`}>3+</span>
                    <span className={`${cinzel.className} text-[0.5rem] tracking-[0.28em] text-white/25 uppercase`}>Years Exp</span>
                </div>
                <div className="w-px h-6 bg-white/10 mb-1" />
                <div className="flex flex-col items-center gap-[3px]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                    <span className={`${cinzel.className} text-[1.25rem] font-bold text-white/70 leading-none`}>12+</span>
                    <span className={`${cinzel.className} text-[0.5rem] tracking-[0.28em] text-white/25 uppercase`}>Projects</span>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 🔪 THE SLASH MASKS (Z-Index 999: These cover everything during transition) */}
            {/* ========================================================================= */}
            <div 
                ref={colorWipeRef}
                className="fixed inset-0 z-[998] pointer-events-none"
                style={{ 
                    backgroundColor: wipeColor, 
                    clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)',
                    WebkitClipPath: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)'
                }} 
            />
            <div 
                ref={blackWipeRef}
                className="fixed inset-0 z-[999] pointer-events-none bg-[#04010a]"
                style={{ 
                    clipPath: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)',
                    WebkitClipPath: 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)'
                }} 
            />

            <Eye ref={eyeRef} onTweakComplete={handleTweakComplete} />
            <EyeHub ref={eyeHubRef} />
        </section>
    );
}