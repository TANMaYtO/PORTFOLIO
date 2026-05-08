"use client";

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Cinzel } from 'next/font/google';
import Image from 'next/image';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

export default function ExperienceScreen() {
    // REFS FOR ANIMATION
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const hudRef = useRef<HTMLDivElement>(null);
    const briefRef = useRef<HTMLDivElement>(null);
    const watermarkRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<SVGSVGElement>(null);
    const assetRef = useRef<HTMLDivElement>(null);
    const backBtnRef = useRef<HTMLButtonElement>(null);
    
    const masterTl = useRef<gsap.core.Timeline>();

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
        
        // 2. The Stage & Asset
        tl.fromTo(stageRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.2);
        tl.fromTo(ringRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.4, duration: 1.2, ease: "power3.out" }, 0.2);
        tl.fromTo(assetRef.current, { y: 50, scale: 0.9, opacity: 0, filter: 'blur(10px)' }, { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: "power3.out" }, 0.6);

        // 3. The HUD Slides In
        tl.fromTo(titleRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.5);
        tl.fromTo('.hud-stat', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.15, ease: "power3.out" }, 0.7);
        
        // 4. The Briefing Terminal
        tl.fromTo(briefRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.9);
        tl.fromTo(watermarkRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" }, 1.0);

        // 5. Navigation
        tl.fromTo(backBtnRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 1.2);

        // Infinite rotation for the ring
        gsap.to(ringRef.current, { rotation: 360, duration: 40, ease: "none", repeat: -1, transformOrigin: "center center" });

        const triggerEntrance = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail === 'experience') masterTl.current?.play();
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
                <h1 className={`${cinzel.className} text-6xl md:text-8xl tracking-[0.1em] text-white/90 drop-shadow-md`}>DEPLOYMENT</h1>
                <h1 className={`${cinzel.className} absolute top-0 left-0 text-6xl md:text-8xl tracking-[0.1em] text-[#cc2222] drop-shadow-[0_0_15px_rgba(204,34,34,0.6)]`} style={{ clipPath: 'circle(60vw at 100vw 50vh)', WebkitClipPath: 'circle(60vw at 100vw 50vh)' }}>DEPLOYMENT</h1>
            </div>

            {/* ZONE 2: THE STATS HUD */}
            <div ref={hudRef} className="absolute top-[22%] left-[5%] z-20 flex flex-col gap-8">
                <div className="hud-stat group">
                    <h2 className={`${cinzel.className} text-5xl md:text-7xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 group-hover:text-[#cc2222] group-hover:drop-shadow-[0_0_20px_rgba(204,34,34,0.8)]`}>500+</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="w-[20px] h-[2px] bg-[#cc2222]" />
                        <span className="text-white/50 text-sm tracking-[0.3em] uppercase font-bold">Weekly Evaluations</span>
                    </div>
                </div>

                <div className="hud-stat group">
                    <h2 className={`${cinzel.className} text-5xl md:text-7xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 group-hover:text-[#cc2222] group-hover:drop-shadow-[0_0_20px_rgba(204,34,34,0.8)]`}>95.0%</h2>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="w-[20px] h-[2px] bg-[#cc2222]" />
                        <span className="text-white/50 text-sm tracking-[0.3em] uppercase font-bold">QA Alignment Score</span>
                    </div>
                </div>
            </div>

            {/* ZONE 3: THE MISSION BRIEFING */}
            <div ref={briefRef} className="absolute bottom-[15%] left-[5%] w-[450px] z-20">
                <div className="bg-black/60 backdrop-blur-md border-l-2 border-[#cc2222] p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                    <div className="flex justify-between items-end mb-4">
                        <h3 className={`${cinzel.className} text-white/90 text-xl font-bold tracking-widest`}>AI DATA ASSOCIATE</h3>
                        <span className="text-[#cc2222] text-xs font-bold tracking-[0.2em]">JAN 2026 — PRESENT</span>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed font-sans mb-3">
                        Conducting RLHF on multi-modal Generative AI models. Maintaining strict quality assurance through rigorous identification of temporal consistency errors and physics-based hallucinations.
                    </p>
                    <p className="text-white/60 text-sm leading-relaxed font-sans">
                        Providing high-velocity ground truth data for model fine-tuning and alignment protocols at Innodata Inc.
                    </p>
                </div>
            </div>

            {/* WATERMARK NUMBER */}
            <div ref={watermarkRef} className="absolute bottom-[5%] left-[5%] z-10 pointer-events-none">
                <span className={`${cinzel.className} text-[20px] font-bold text-white/10 tracking-[0.5em]`}>STATUS: ACTIVE // INNODATA INC.</span>
            </div>

            {/* ZONE 4: THE ALIGNMENT MATRIX STAGE */}
            <div className="absolute top-0 right-[-10%] w-[1000px] h-screen flex items-center justify-center z-10 pointer-events-none">
                
                <div ref={stageRef} className="stage-circle absolute rounded-full bg-gradient-to-br from-[#1a0505] to-[#000000] shadow-[-50px_0_100px_rgba(20,0,0,0.9)] border-l border-[#cc2222]/20" style={{ width: '120vw', height: '120vw', right: '-60vw', top: 'calc(50vh - 60vw)' }} />

                <svg ref={ringRef} className="absolute w-[800px] h-[800px]" viewBox="0 0 500 500">
                    <defs><path id="expTextPath" d="M 250, 250 m -220, 0 a 220,220 0 1,1 440,0 a 220,220 0 1,1 -440,0" /></defs>
                    <text fill="#ffffff" className={`${cinzel.className} text-[22px] tracking-[0.4em] uppercase`}>
                        <textPath href="#expTextPath" startOffset="0%">Inspect The Matrix  ✦  Inspect The Matrix  ✦  Inspect The Matrix  ✦</textPath>
                    </text>
                    <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(204,34,34,0.3)" strokeWidth="1" />
                </svg>

                <div ref={assetRef} className="absolute z-20 w-[550px] h-[550px]">
                    <Image 
                        src="/exp-core.png" // The chaotic glowing core you generate!
                        alt="The Alignment Matrix" 
                        fill 
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-contain drop-shadow-[0_0_60px_rgba(204,34,34,0.6)] animate-float" 
                    />
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

            {/* Global Styles */}
            <style>{`
                @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(2deg); } 100% { transform: translateY(0px) rotate(0deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </section>
    );
}