"use client";

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Cinzel } from 'next/font/google';
import Image from 'next/image';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

const SKILLS_DATA = [
    {
        id: 'ai',
        num: '01',
        title: 'INTELLIGENCE',
        desc: 'Architecting deployable neural networks, LLM evaluation frameworks, and agentic workflows. Expertise in rigorous model alignment and continuous Bayesian calibration.',
        list: ['PyTorch', 'Transformers', 'CatBoost', 'LangGraph', 'RAG'], // [cite: 13]
        asset: '/skill-ai.png'
    },
    {
        id: 'pipelines',
        num: '02',
        title: 'PIPELINES',
        desc: 'Designing out-of-core data processing pipelines and semantic search architectures. Utilizing lazy evaluation to compute sub-second temporal variances without RAM bottlenecks.',
        list: ['Polars', 'Pandas', 'FAISS', 'Out-of-Core', 'Semantic Search'], // 
        asset: '/skill-db.png' // Use the Iron Chest artifact for this!
    },
    {
        id: 'architecture',
        num: '03',
        title: 'ARCHITECTURE',
        desc: 'Engineering robust, scalable MLOps infrastructure. Managing secure subprocess sandboxing, ASGI container optimization, and high-throughput FastAPI endpoints.',
        list: ['FastAPI', 'Python', 'AWS (EC2)', 'Uvicorn/ASGI', 'Sandboxing'], // [cite: 12, 15]
        asset: '/skill-backend.png'
    },
    {
        id: 'interface',
        num: '04',
        title: 'INTERFACE',
        desc: 'Engineering highly kinetic, cinematic visual layers. Implementing complex GSAP animations, agentic portfolio workflows, and deterministic UI state management.',
        list: ['React', 'Next.js', 'GSAP', 'Tailwind CSS', 'Antigravity'],
        asset: '/skill-frontend.png'
    },
    {
        id: 'arsenal',
        num: '05',
        title: 'ARSENAL',
        desc: 'Deploying containerized environments and rigorous testing suites. Orchestrating cold-start optimizations for Hugging Face Spaces and managing version control.',
        list: ['Docker', 'Hugging Face', 'Git', 'Pytest', 'Postman'], // [cite: 15]
        asset: '/skill-tools.png'
    }
];

export default function SkillsScreen() {
    const [activeIndex, setActiveIndex] = useState(0);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<SVGSVGElement>(null);
    const handRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLDivElement>(null);
    const watermarkRef = useRef<HTMLDivElement>(null);
    const selectorRef = useRef<HTMLDivElement>(null);
    const assetRef = useRef<HTMLDivElement>(null);
    const backBtnRef = useRef<HTMLButtonElement>(null);
    
    const masterTl = useRef<gsap.core.Timeline>();

    const activeSkill = SKILLS_DATA[activeIndex];

    useGSAP(() => {
        masterTl.current = gsap.timeline({ 
            paused: true,
            onReverseComplete: () => {
                gsap.set(containerRef.current, { opacity: 0, pointerEvents: 'none' });
                window.dispatchEvent(new Event('returnToMenu'));
            }
        });

        const tl = masterTl.current;

        tl.to(containerRef.current, { opacity: 1, pointerEvents: 'auto', duration: 0.5, ease: "power2.out" }, 0);
        tl.fromTo('.stage-circle', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" }, 0.2);
        tl.fromTo(ringRef.current, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.4, duration: 1.2, ease: "power3.out" }, 0.2);
        tl.fromTo(handRef.current, { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.5, ease: "power2.out" }, 0.3);
        
        tl.fromTo(titleRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.5);
        tl.fromTo(descRef.current, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.6);
        tl.fromTo(watermarkRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, 0.7);
        
        tl.fromTo(selectorRef.current, { scaleY: 0, opacity: 0 }, { scaleY: 1, opacity: 1, duration: 0.8, ease: "power2.out" }, 0.7);
        tl.fromTo('.skill-notch', { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "back.out(1.5)" }, 0.9);
        
        tl.fromTo(assetRef.current, { scale: 0.5, opacity: 0, filter: 'blur(10px)' }, { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.2, ease: "expo.out" }, 1.0);
        tl.fromTo(backBtnRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 1.2);

        gsap.to(ringRef.current, { rotation: -360, duration: 40, ease: "none", repeat: -1, transformOrigin: "center center" });

        const triggerEntrance = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail === 'skills') masterTl.current?.play();
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
                <h1 className={`${cinzel.className} text-6xl md:text-8xl tracking-[0.1em] text-white/90 drop-shadow-md`}>ARSENAL</h1>
                <h1 className={`${cinzel.className} absolute top-0 left-0 text-6xl md:text-8xl tracking-[0.1em] text-[#cc2222] drop-shadow-[0_0_15px_rgba(204,34,34,0.6)]`} style={{ clipPath: 'circle(60vw at 100vw 50vh)', WebkitClipPath: 'circle(60vw at 100vw 50vh)' }}>ARSENAL</h1>
            </div>

            {/* ZONE 2: DESCRIPTION & LIST */}
            <div ref={descRef} className="absolute top-[25%] left-[5%] w-[320px] z-20">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-[20px] p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                    <h3 className={`${cinzel.className} text-[#cc2222] text-xl font-bold tracking-widest mb-4 drop-shadow-[0_0_5px_rgba(204,34,34,0.8)]`}>
                        {activeSkill.title}
                    </h3>
                    <p className="text-white/70 text-sm leading-relaxed font-sans transition-all duration-300 mb-6">
                        {activeSkill.desc}
                    </p>
                    <div className="flex flex-col gap-2">
                        {activeSkill.list.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-[4px] h-[4px] bg-[#cc2222] rotate-45 shadow-[0_0_8px_rgba(204,34,34,0.8)]" />
                                <span className={`${cinzel.className} text-white/80 text-sm tracking-wider uppercase`}>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* WATERMARK NUMBER */}
            <div ref={watermarkRef} className="absolute bottom-[5%] left-[5%] z-10 pointer-events-none">
                <span className={`${cinzel.className} text-[20px] font-bold text-white/10 tracking-[0.5em] transition-all duration-300`}>SKILL ENTRY: {activeSkill.num}</span>
            </div>

            {/* ZONE 3: VERTICAL SELECTOR */}
            <div ref={selectorRef} className="absolute top-1/2 left-[36%] -translate-y-1/2 h-[400px] w-[200px] z-30" style={{ transformOrigin: 'top center' }}>
                <div className="absolute left-[20px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                
                <div className="flex flex-col justify-between h-full absolute left-[12px] top-0 bottom-0 w-full py-4">
                    {SKILLS_DATA.map((skill, i) => {
                        const isActive = activeIndex === i;
                        return (
                            <div 
                                key={skill.id}
                                className="skill-notch flex items-center gap-4 cursor-pointer group"
                                onClick={() => setActiveIndex(i)}
                            >
                                <div className={`relative w-[18px] h-[18px] border transition-all duration-300 flex items-center justify-center rotate-45 ${isActive ? 'border-[#cc2222] bg-[#cc2222]/20 shadow-[0_0_15px_rgba(204,34,34,0.6)]' : 'border-white/30 group-hover:border-white'}`}>
                                    {isActive && <div className="w-[6px] h-[6px] bg-[#cc2222] shadow-[0_0_10px_rgba(204,34,34,1)]" />}
                                </div>
                                <span className={`${cinzel.className} text-sm font-bold tracking-widest transition-all duration-300 ${isActive ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'text-white/40 group-hover:text-white/80'}`}>
                                    {skill.title}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ZONE 4: THE INSPECTION STAGE */}
            <div className="absolute top-0 right-[-10%] w-[1000px] h-screen flex items-center justify-center z-10 pointer-events-none">
                <div className="stage-circle absolute rounded-full bg-gradient-to-br from-[#1a0505] to-[#000000] shadow-[-50px_0_100px_rgba(20,0,0,0.9)] border-l border-[#cc2222]/20" style={{ width: '120vw', height: '120vw', right: '-60vw', top: 'calc(50vh - 60vw)' }} />

                <svg ref={ringRef} className="absolute w-[800px] h-[800px]" viewBox="0 0 500 500">
                    <defs><path id="skillTextPath" d="M 250, 250 m -220, 0 a 220,220 0 1,1 440,0 a 220,220 0 1,1 -440,0" /></defs>
                    <text fill="#ffffff" className={`${cinzel.className} text-[22px] tracking-[0.4em] uppercase`}>
                        <textPath href="#skillTextPath" startOffset="0%">Inspect Your Arsenal  ✦  Inspect Your Arsenal  ✦</textPath>
                    </text>
                    <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(204,34,34,0.3)" strokeWidth="1" />
                </svg>

                <div ref={assetRef} className="absolute z-20 w-[500px] h-[500px]">
                    <Image key={activeIndex} src={activeSkill.asset} alt="Artifact" fill sizes="(max-width: 768px) 100vw, 600px" className="object-contain drop-shadow-[0_0_60px_rgba(204,34,34,0.6)] animate-float" />
                </div>

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
                @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(2deg); } 100% { transform: translateY(0px) rotate(0deg); } }
                .animate-float { animation: float 6s ease-in-out infinite; }
            `}</style>
        </section>
    );
}