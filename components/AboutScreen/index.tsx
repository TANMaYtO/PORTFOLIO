"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Cinzel } from 'next/font/google';
import Image from 'next/image';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

// 📖 THE REFORGED LORE DATA 
const LORE_CHAPTERS = [
    {
        id: 'origins',
        title: 'I. THE CATALYST',
        text: 'Forged in Alwar. Driven by an absolute obsession with systemic perfection. Abandoned the static, predictable nature of traditional web environments to pursue the infinite complexity of Artificial Intelligence.'
    },
    {
        id: 'craft',
        title: 'II. THE ARCHITECTURE',
        text: 'Engineering philosophy centers on breaking machine limits. Proven through a Top 3% rank in the Amazon ML Challenge and the deployment of out-of-core pipelines that execute complex temporal variances without RAM bottlenecks.'
    },
    {
        id: 'alias',
        title: 'III. THE SYNTHESIS',
        text: 'Operating under the moniker Laeddis. A strict compartmentalization of deterministic logic and dark cinematic art. The audio synthesis of melancholic concepts, isolated entirely from the daily engineering pipelines.'
    }
];

// 🗡️ THE SWORD MILESTONES
const SWORD_MILESTONES = [
    { year: '2023', label: 'MITRC INITIATION' },            
    { year: '2025', label: 'KAGGLE TOP 5%' },           
    { year: '2026', label: 'AMAZON ML TOP 3%' },        
    { year: '2026', label: 'INNODATA DEPLOYMENT' },        
    { year: '2026', label: 'LAEDDIS AUDIO' },           
];

export default function AboutScreen() {
    const [activeNotch, setActiveNotch] = useState<number | null>(null);

    // REFS FOR ANIMATION
    const containerRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<SVGSVGElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const chaptersRef = useRef<HTMLDivElement>(null);
    const swordRef = useRef<HTMLDivElement>(null);
    const portraitRef = useRef<HTMLDivElement>(null);
    const handRef = useRef<HTMLDivElement>(null); // ✋ ADDED HAND REF
    const backBtnRef = useRef<HTMLButtonElement>(null);
    
    const masterTl = useRef<gsap.core.Timeline | null>(null);

    useGSAP(() => {
        masterTl.current = gsap.timeline({ 
            paused: true,
            onReverseComplete: () => {
                gsap.set(containerRef.current, { opacity: 0, pointerEvents: 'none' });
                window.dispatchEvent(new Event('returnToMenu'));
            }
        });

        const tl = masterTl.current;

        // 1. The Void Awakens
        tl.to(containerRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: "power2.out" }, 0);
        tl.fromTo('.stage-circle', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.2);
        tl.fromTo(ringRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.4, duration: 1.2, ease: "power3.out" }, 0.2);

        // 2. The Sword Slams Down
        tl.fromTo(swordRef.current, { y: '-100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 1.0, ease: "bounce.out" }, 0.4);
        tl.fromTo('.sword-notch', { scale: 0, opacity: 0, rotation: 0 }, { scale: 1, opacity: 1, rotation: 45, duration: 0.4, stagger: 0.15, ease: "back.out(2)" }, 0.8);

        // 3. The Stage Elements (Hands + Monolith)
        tl.fromTo(handRef.current, { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.5, ease: "power2.out" }, 0.3); // ✋ HAND ANIMATION
        tl.fromTo(portraitRef.current, { y: 50, scale: 0.85, opacity: 0, filter: 'blur(15px)' }, { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.8, ease: "power3.out" }, 0.6); // REPOSITIONED MONOLITH

        // 4. The Lore Decodes
        tl.fromTo(titleRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.7);
        tl.fromTo('.lore-chapter', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }, 0.9);

        // 5. Navigation
        tl.fromTo(backBtnRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 1.2);

        // Infinite rotation for the ring
        gsap.to(ringRef.current, { rotation: 360, duration: 45, ease: "none", repeat: -1, transformOrigin: "center center" });

        const triggerEntrance = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail === 'about') masterTl.current?.play();
        };

        window.addEventListener('menuBreach', triggerEntrance);
        return () => window.removeEventListener('menuBreach', triggerEntrance);

    }, { scope: containerRef });

    const handleBackClick = () => {
        gsap.set(containerRef.current, { pointerEvents: 'none' });
        masterTl.current?.reverse();
    };

    return (
        <section ref={containerRef} className="fixed inset-0 bg-[#0a0202] text-white overflow-hidden selection:bg-[#cc2222]/30 z-[1000] opacity-0 pointer-events-none">
            
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <Image src="/subtle-crimson-bg.png" alt="Crimson Texture" fill sizes="100vw" className="object-cover" priority />
            </div>

            {/* ZONE 1: TITLE */}
            <div ref={titleRef} className="absolute top-[6%] left-[5%] z-20">
                <h1 className={`${cinzel.className} text-6xl md:text-8xl tracking-[0.1em] text-white/90 drop-shadow-md`}>ABOUT</h1>
                <h1 className={`${cinzel.className} absolute top-0 left-0 text-6xl md:text-8xl tracking-[0.1em] text-[#cc2222] drop-shadow-[0_0_15px_rgba(204,34,34,0.6)]`} style={{ clipPath: 'circle(60vw at 100vw 50vh)', WebkitClipPath: 'circle(60vw at 100vw 50vh)' }}>ABOUT</h1>
            </div>

            {/* ZONE 2: LORE CHAPTERS */}
            <div ref={chaptersRef} className="absolute top-[25%] left-[5%] w-[380px] z-20 flex flex-col gap-8">
                {LORE_CHAPTERS.map((chapter) => (
                    <div key={chapter.id} className="lore-chapter group relative pl-5 border-l-2 border-white/10 hover:border-[#cc2222] transition-colors duration-500">
                        <div className="absolute left-[-4px] top-[8px] w-[6px] h-[6px] bg-[#cc2222] rounded-full opacity-0 group-hover:opacity-100 shadow-[0_0_10px_rgba(204,34,34,0.8)] transition-opacity duration-300" />
                        <h3 className={`${cinzel.className} text-white/80 text-lg font-bold tracking-widest mb-3 group-hover:text-[#cc2222] transition-colors duration-300 drop-shadow-md`}>
                            {chapter.title}
                        </h3>
                        <p className="text-white/60 text-sm leading-relaxed font-sans group-hover:text-white/90 transition-colors duration-300">
                            {chapter.text}
                        </p>
                    </div>
                ))}
            </div>

            {/* WATERMARK NUMBER */}
            <div className="absolute bottom-[5%] left-[5%] z-10 pointer-events-none">
                <span className={`${cinzel.className} text-[20px] font-bold text-white/10 tracking-[0.5em]`}>LORE ENTRY: LAEDDIS</span>
            </div>

            {/* ZONE 3: THE SWORD TIMELINE */}
            <div className="absolute top-0 left-[42%] h-screen w-[120px] z-30 pointer-events-none">
                <div ref={swordRef} className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-white/40 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <div className="absolute top-[10%] bottom-[10%] left-0 w-full bg-[#cc2222]/30 blur-[2px]" />
                </div>

                {SWORD_MILESTONES.map((stone, i) => {
                    const topPos = `${18 + (i * 18)}%`;
                    const isActive = activeNotch === i;
                    
                    return (
                        <div 
                            key={i}
                            className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center pointer-events-auto cursor-pointer group"
                            style={{ top: topPos }}
                            onMouseEnter={() => setActiveNotch(i)}
                            onMouseLeave={() => setActiveNotch(null)}
                        >
                            <div className={`absolute right-[30px] whitespace-nowrap text-right transition-all duration-300 ${isActive ? 'opacity-100 pr-2' : 'opacity-0 pr-0'}`}>
                                <div className={`${cinzel.className} text-[#cc2222] text-xl font-bold drop-shadow-[0_0_10px_rgba(204,34,34,0.8)]`}>{stone.year}</div>
                                <div className="text-white/70 text-xs font-bold tracking-widest uppercase">{stone.label}</div>
                            </div>
                            <div className={`sword-notch w-[14px] h-[14px] border border-[#cc2222] bg-[#0a0202] transition-all duration-300 ${isActive ? 'bg-[#cc2222] shadow-[0_0_20px_rgba(204,34,34,1)] scale-125' : 'group-hover:bg-[#cc2222]/50'}`} />
                        </div>
                    );
                })}
            </div>

            {/* ZONE 4: THE MONOLITH STAGE */}
            <div className="absolute top-0 right-[-10%] w-[1000px] h-screen flex items-center justify-center z-10 pointer-events-none">
                
                <div className="stage-circle absolute rounded-full bg-gradient-to-br from-[#1a0505] to-[#000000] shadow-[-50px_0_100px_rgba(20,0,0,0.9)] border-l border-[#cc2222]/20" style={{ width: '120vw', height: '120vw', right: '-60vw', top: 'calc(50vh - 60vw)' }} />

                <svg ref={ringRef} className="absolute w-[800px] h-[800px]" viewBox="0 0 500 500">
                    <defs><path id="aboutTextPath" d="M 250, 250 m -220, 0 a 220,220 0 1,1 440,0 a 220,220 0 1,1 -440,0" /></defs>
                    <text fill="#ffffff" className={`${cinzel.className} text-[22px] tracking-[0.4em] uppercase`}>
                        <textPath href="#aboutTextPath" startOffset="0%">Inspect The Architecture  ✦  Inspect The Architecture  ✦</textPath>
                    </text>
                    <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(204,34,34,0.3)" strokeWidth="1" />
                </svg>

                {/* THE NEW OBSIDIAN MONOLITH (Shrunk & Centered) */}
                <div ref={portraitRef} className="absolute z-20 w-[450px] h-[600px] translate-y-[-5%]"> 
                    <Image 
                        src="/monolith.png" 
                        alt="The Architecture Monolith" 
                        fill 
                        sizes="(max-width: 768px) 100vw, 450px"
                        className="object-contain object-bottom drop-shadow-[0_0_60px_rgba(204,34,34,0.3)] animate-float" 
                        style={{
                            maskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)',
                            WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 100%)'
                        }}
                        priority
                    />
                </div>

                {/* ✋ THE HAND (Summoning the Monolith) */}
                <div ref={handRef} className="absolute bottom-[0%] z-30 w-[600px] h-[500px]">
                    <Image src="/hand-placeholder.png" alt="Hand" fill sizes="(max-width: 768px) 100vw, 600px" className="object-contain object-bottom" priority />
                </div>
            </div>

            {/* ZONE 5: THE BACK BUTTON */}
            <button 
                ref={backBtnRef}
                onClick={handleBackClick}
                className="absolute bottom-[5%] right-[5%] z-50 flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300 group pointer-events-auto"
            >
                <div className="w-[30px] h-[30px] rounded-full border border-white/30 flex items-center justify-center group-hover:border-[#cc2222] group-hover:bg-[#cc2222]/20 transition-all duration-300">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </div>
                <span className={`${cinzel.className} tracking-[0.3em] font-bold text-sm mt-[2px]`}>BACK</span>
            </button>
            
            <style>{`
                @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(1deg); } 100% { transform: translateY(0px) rotate(0deg); } }
                .animate-float { animation: float 8s ease-in-out infinite; }
            `}</style>
        </section>
    );
}