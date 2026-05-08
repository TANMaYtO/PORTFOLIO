"use client";

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Cinzel } from 'next/font/google';
import Image from 'next/image';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

// 🎯 YOUR RESUME PROJECTS
const PROJECTS_DATA = [
    {
        id: 'v24',
        num: '01',
        title: 'V24 Fraud Architecture',
        shortName: 'V24 Fraud System',
        desc: 'Engineered an out-of-core pipeline using Polars and Lazy Evaluation to compute sub-second temporal variances, predicting automated cartel bot behavior without RAM bottlenecks. Designed a 2-model absolute probability blend (CatBoost & LightGBM) utilizing Continuous Bayesian Calibration to map spatial clusters, achieving a deployment-grade 0.910 F1 score.',
        asset: '/project-1-asset.png' 
    },
    {
        id: 'ae2',
        num: '02',
        title: 'AE2: Applied AI Env',
        shortName: 'AE2 Sandbox',
        desc: 'Engineered a containerized RL environment (OpenEnv spec) via FastAPI to evaluate LLM coding capabilities, implementing secure subprocess sandboxing with hard timeouts to mitigate ACE risks. Developed a deterministic evaluation engine utilizing dense, multi-variate reward functions to penalize time/space complexity.',
        asset: '/project-2-asset.png' 
    },
    {
        id: 'forensics',
        num: '03',
        title: 'Digital Forensics Kit',
        shortName: 'Forensics API',
        desc: 'Engineered a RAG + NLI classifier pipeline (MiniLM, DEBERTA) to detect misinformation, achieving >80% confidence on unseen testing data. Integrated 4 distinct analysis modules (ELA, OCR, Reverse Search, Text Analysis) into a single API, reducing manual fact-checking time by 60%. Orchestrated via FastAPI and Docker.',
        asset: '/project-3-asset.png' 
    }
];

export default function ProjectsScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    
    // REFS FOR ANIMATION
    const containerRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<SVGSVGElement>(null);
    const handRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);
    const watermarkRef = useRef<HTMLDivElement>(null);
    const carouselRef = useRef<HTMLDivElement>(null);
    const assetRef = useRef<HTMLDivElement>(null);
    const backBtnRef = useRef<HTMLButtonElement>(null);
    
    // Store the master timeline so we can reverse it!
    const masterTl = useRef<gsap.core.Timeline>();

    const activeProject = PROJECTS_DATA[activeIndex];

    useGSAP(() => {
        // Timeline starts paused. When it REVERSES and hits the beginning, it fires 'returnToMenu'
        masterTl.current = gsap.timeline({ 
            paused: true,
            onReverseComplete: () => {
                // 🛑 ADDED OPACITY: 0 HERE! This deletes the invisible wall!
                gsap.set(containerRef.current, { opacity: 0, pointerEvents: 'none' });
                console.log("⏪ REVERSE COMPLETE. FIRING returnToMenu EVENT");
                window.dispatchEvent(new Event('returnToMenu'));
            }
        });

        const tl = masterTl.current;

        // 1. Base Container Fade In
        tl.to(containerRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: "power2.out" }, 0);

        // 2. Stage Circle & Ring Fade In
        tl.fromTo('.stage-circle', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.2);
        tl.fromTo(ringRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.4, duration: 1.2, ease: "power3.out" }, 0.2);

        // 3. The Hand Reaches Up
        tl.fromTo(handRef.current, { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.5, ease: "power2.out" }, 0.3);

        // 4. UI Elements Slide In (The "Build" Effect)
        tl.fromTo(titleRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.5);
        tl.fromTo(descRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.6);
        tl.fromTo(watermarkRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0.7);

        // 5. Carousel Nodes cascade in
        tl.fromTo('.carousel-node', 
            { x: -30, opacity: 0 }, 
            { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)" }, 
        0.8);

        // 6. The Main Asset Materializes
        tl.fromTo(assetRef.current, 
            { scale: 0.5, opacity: 0, filter: 'blur(10px)' }, 
            { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: "expo.out" }, 
        1.0);

        // 7. Back Button Fades In
        tl.fromTo(backBtnRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 1.2);

        // Infinite rotation for the SVG text ring (runs independently)
        gsap.to(ringRef.current, {
            rotation: 360, duration: 40, ease: "none", repeat: -1, transformOrigin: "center center"
        });

        // TRIGGER LISTENER
        const triggerEntrance = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail === 'projects') masterTl.current?.play();
        };

        window.addEventListener('menuBreach', triggerEntrance);
        return () => window.removeEventListener('menuBreach', triggerEntrance);

    }, { scope: containerRef });

    // The Exit Function
    const handleBackClick = () => {
        // Disables clicks so user can't spam it during the exit animation
        gsap.set(containerRef.current, { pointerEvents: 'none' });
        // Plays the entire timeline backwards perfectly!
        masterTl.current?.reverse();
    };

    return (
        <section ref={containerRef} className="fixed inset-0 bg-[#0a0202] text-white overflow-hidden selection:bg-[#cc2222]/30 z-[1000] opacity-0 pointer-events-none">
            
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <Image src="/subtle-crimson-bg.png" alt="Crimson Texture" fill sizes="100vw" className="object-cover" priority />
            </div>

            {/* ZONE 1: TITLE */}
            <div ref={titleRef} className="absolute top-[6%] left-[5%] z-20">
                <h1 className={`${cinzel.className} text-6xl md:text-8xl tracking-[0.1em] text-white/90 drop-shadow-md`}>
                    PROJECTS
                </h1>
                <h1 
                    className={`${cinzel.className} absolute top-0 left-0 text-6xl md:text-8xl tracking-[0.1em] text-[#cc2222] drop-shadow-[0_0_15px_rgba(204,34,34,0.6)]`}
                    style={{ clipPath: 'circle(60vw at 100vw 50vh)', WebkitClipPath: 'circle(60vw at 100vw 50vh)' }}
                >
                    PROJECTS
                </h1>
            </div>

            {/* ZONE 2: DESCRIPTION */}
            <div ref={descRef} className="absolute top-[25%] left-[5%] w-[320px] z-20">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-[20px] p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                    <h3 className={`${cinzel.className} text-[#cc2222] text-xl font-bold tracking-widest mb-4 drop-shadow-[0_0_5px_rgba(204,34,34,0.8)]`}>
                        DESCRIPTION
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed font-sans transition-all duration-300">
                        {activeProject.desc}
                    </p>
                </div>
            </div>

            {/* WATERMARK NUMBER */}
            <div ref={watermarkRef} className="absolute bottom-[5%] left-[5%] z-10 pointer-events-none">
                <span className={`${cinzel.className} text-[150px] font-black text-white/5 leading-none tracking-tighter transition-all duration-300`}>
                    {activeProject.num}
                </span>
            </div>

            {/* ZONE 3: ORBITAL ARC MENU */}
            <div 
                ref={carouselRef}
                className="absolute top-1/2 left-[36%] -translate-y-1/2 h-[450px] w-[180px] z-30"
                onWheel={(e) => {
                    if (e.deltaY > 0) setActiveIndex((prev) => (prev + 1) % PROJECTS_DATA.length);
                    if (e.deltaY < 0) setActiveIndex((prev) => (prev - 1 + PROJECTS_DATA.length) % PROJECTS_DATA.length);
                }}
            >
                <svg className="absolute left-[10px] top-0 w-[80px] h-full pointer-events-none opacity-20" viewBox="0 0 80 450">
                    <path d="M 60,30 Q 0,225 60,420" stroke="white" strokeWidth="2" fill="none" />
                </svg>

                <div className="absolute top-[10px] left-[65px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-[#cc2222] opacity-70 animate-pulse rotate-[25deg]" />
                <div className="absolute bottom-[10px] left-[65px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[10px] border-t-[#cc2222] opacity-70 animate-pulse -rotate-[25deg]" />
                
                {PROJECTS_DATA.map((proj, i) => {
                    const diff = (i - activeIndex + PROJECTS_DATA.length) % PROJECTS_DATA.length;
                    
                    let topPos = '50%'; let leftPos = '0px'; let scale = 1; let opacity = 1; let zIndex = 10;

                    if (diff === 1) { topPos = '72%'; leftPos = '22px'; scale = 0.65; opacity = 0.5; zIndex = 5; } 
                    else if (diff === 2) { topPos = '28%'; leftPos = '22px'; scale = 0.65; opacity = 0.5; zIndex = 5; }

                    const isActive = diff === 0;

                    return (
                        <div 
                            key={proj.id}
                            className="carousel-node absolute flex items-center gap-3 cursor-pointer group transition-all duration-500 ease-out"
                            style={{ top: topPos, left: leftPos, transform: `translateY(-50%) scale(${scale})`, opacity, zIndex, transformOrigin: 'left center' }}
                            onClick={() => setActiveIndex(i)}
                        >
                            <div className={`relative w-[45px] h-[45px] rounded-full border-2 transition-colors duration-300 flex items-center justify-center bg-transparent overflow-hidden ${isActive ? 'border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]' : 'border-white/20 group-hover:border-[#cc2222]/50'}`}>
                                <Image src={proj.asset} alt={proj.shortName} fill sizes="45px" className="object-contain p-[6px]" />
                            </div>
                            <div className={`flex items-center overflow-hidden transition-all duration-500 ${isActive ? 'w-[250px] opacity-100' : 'w-0 opacity-0'}`}>
                                <div className="w-[30px] h-[2px] bg-white" />
                                <div className="bg-white text-black font-bold px-3 py-1 text-xs whitespace-nowrap shadow-[0_0_15px_rgba(255,255,255,0.3)] clip-tag">
                                    {proj.title}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* ZONE 4: THE INSPECTION STAGE */}
            <div className="absolute top-0 right-[-10%] w-[1000px] h-screen flex items-center justify-center z-10 pointer-events-none">
                
                <div className="stage-circle absolute rounded-full bg-gradient-to-br from-[#1a0505] to-[#000000] shadow-[-50px_0_100px_rgba(20,0,0,0.9)] border-l border-[#cc2222]/20" style={{ width: '120vw', height: '120vw', right: '-60vw', top: 'calc(50vh - 60vw)' }} />

                <svg ref={ringRef} className="absolute w-[800px] h-[800px]" viewBox="0 0 500 500">
                    <defs><path id="textPath" d="M 250, 250 m -220, 0 a 220,220 0 1,1 440,0 a 220,220 0 1,1 -440,0" /></defs>
                    <text fill="#ffffff" className={`${cinzel.className} text-[22px] tracking-[0.4em] uppercase`}>
                        <textPath href="#textPath" startOffset="0%">Inspect Your Project  ✦  Inspect Your Project  ✦  Inspect Your Project  ✦</textPath>
                    </text>
                    <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(204,34,34,0.3)" strokeWidth="1" />
                </svg>

                <div ref={assetRef} className="absolute z-20 w-[500px] h-[500px]">
                    <Image key={activeIndex} src={activeProject.asset} alt="Project Asset" fill sizes="(max-width: 768px) 100vw, 600px" className="object-contain drop-shadow-[0_0_60px_rgba(204,34,34,0.6)] animate-float" />
                </div>

                <div ref={handRef} className="absolute bottom-[0%] z-30 w-[600px] h-[500px]">
                    <Image src="/hand-placeholder.png" alt="Hand" fill sizes="(max-width: 768px) 100vw, 600px" className="object-contain object-bottom" priority />
                </div>
            </div>

            {/* ZONE 5: THE BACK BUTTON */}
            <button 
                ref={backBtnRef}
                onClick={handleBackClick}
                className="absolute bottom-[5%] right-[5%] z-50 flex items-center gap-3 text-white/50 hover:text-white transition-colors duration-300 group"
            >
                <div className="w-[30px] h-[30px] rounded-full border border-white/30 flex items-center justify-center group-hover:border-[#cc2222] group-hover:bg-[#cc2222]/20 transition-all duration-300">
                    {/* Minimalist Left Arrow */}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                </div>
                <span className={`${cinzel.className} tracking-[0.3em] font-bold text-sm mt-[2px]`}>BACK</span>
            </button>

            {/* Global Styles */}
            <style>{`
                .clip-tag { clip-path: polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%); }
                @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(2deg); } 100% { transform: translateY(0px) rotate(0deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>

        </section>
    );
}