"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Cinzel } from 'next/font/google';
import Image from 'next/image';

const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'] });

export default function ContactScreen() {
    const [formStatus, setFormStatus] = useState('AWAITING INPUT...');
    
    // REFS FOR ANIMATION
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const watermarkRef = useRef<HTMLDivElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<SVGSVGElement>(null);
    const assetRef = useRef<HTMLDivElement>(null);
    const handRef = useRef<HTMLDivElement>(null);
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
        tl.fromTo(handRef.current, { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.5, ease: "power2.out" }, 0.3);
        tl.fromTo(assetRef.current, { y: 50, scale: 0.9, opacity: 0, filter: 'blur(10px)' }, { y: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.5, ease: "power3.out" }, 0.6);

        // 3. The Left Panel (Title & Links)
        tl.fromTo(titleRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.5);
        tl.fromTo('.contact-link', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }, 0.7);
        
        // 4. The Terminal Form
        tl.fromTo(formRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, 0.9);
        tl.fromTo(watermarkRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power2.out" }, 1.0);

        // 5. Navigation
        tl.fromTo(backBtnRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }, 1.2);

        // Infinite rotation for the ring
        gsap.to(ringRef.current, { rotation: 360, duration: 40, ease: "none", repeat: -1, transformOrigin: "center center" });

        const triggerEntrance = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (customEvent.detail === 'contact') masterTl.current?.play();
        };

        window.addEventListener('menuBreach', triggerEntrance);
        return () => window.removeEventListener('menuBreach', triggerEntrance);

    }, { scope: containerRef });

    const handleBackClick = () => {
        gsap.set(containerRef.current, { pointerEvents: 'none' });
        masterTl.current?.reverse();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('TRANSMISSION SENT.');
        // Add your actual form submission logic here later (like EmailJS or Formspree)
    };

    return (
        <section ref={containerRef} className="fixed inset-0 bg-[#0a0202] text-white overflow-hidden selection:bg-[#cc2222]/30 z-[1000] opacity-0 pointer-events-none">
            
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <Image src="/subtle-crimson-bg.png" alt="Crimson Texture" fill sizes="100vw" className="object-cover" priority />
            </div>

            {/* ZONE 1: TITLE */}
            <div ref={titleRef} className="absolute top-[6%] left-[5%] z-20">
                <h1 className={`${cinzel.className} text-6xl md:text-8xl tracking-[0.1em] text-white/90 drop-shadow-md`}>CONTACT</h1>
                <h1 className={`${cinzel.className} absolute top-0 left-0 text-6xl md:text-8xl tracking-[0.1em] text-[#cc2222] drop-shadow-[0_0_15px_rgba(204,34,34,0.6)]`} style={{ clipPath: 'circle(60vw at 100vw 50vh)', WebkitClipPath: 'circle(60vw at 100vw 50vh)' }}>CONTACT</h1>
            </div>

            {/* ZONE 2: THE COORDINATES */}
            <div ref={linksRef} className="absolute top-[22%] left-[5%] z-20 flex flex-col gap-4">
                <a href="mailto:tomartanmay1109@gmail.com" className="contact-link group flex items-center gap-4 cursor-pointer">
                    <div className="w-[8px] h-[8px] bg-[#cc2222] rotate-45 shadow-[0_0_10px_rgba(204,34,34,0.8)] group-hover:scale-150 transition-transform duration-300" />
                    <span className="text-white/70 tracking-[0.2em] uppercase text-sm font-bold group-hover:text-white transition-colors duration-300">tomartanmay1109@gmail.com</span>
                </a>
                <div className="contact-link group flex items-center gap-4 cursor-pointer">
                    <div className="w-[8px] h-[8px] bg-[#cc2222] rotate-45 shadow-[0_0_10px_rgba(204,34,34,0.8)] group-hover:scale-150 transition-transform duration-300" />
                    <span className="text-white/70 tracking-[0.2em] uppercase text-sm font-bold group-hover:text-white transition-colors duration-300">+91-7850824437</span>
                </div>
                <a href="https://www.linkedin.com/in/tanmay-tomar-430500281" target="_blank" rel="noreferrer" className="contact-link group flex items-center gap-4 cursor-pointer">
                    <div className="w-[8px] h-[8px] bg-white/30 rotate-45 group-hover:bg-[#cc2222] group-hover:shadow-[0_0_10px_rgba(204,34,34,0.8)] group-hover:scale-150 transition-all duration-300" />
                    <span className="text-white/50 tracking-[0.2em] uppercase text-sm font-bold group-hover:text-white transition-colors duration-300">LinkedIn Network</span>
                </a>
                <a href="https://github.com/TANMaYtO" target="_blank" rel="noreferrer" className="contact-link group flex items-center gap-4 cursor-pointer">
                    <div className="w-[8px] h-[8px] bg-white/30 rotate-45 group-hover:bg-[#cc2222] group-hover:shadow-[0_0_10px_rgba(204,34,34,0.8)] group-hover:scale-150 transition-all duration-300" />
                    <span className="text-white/50 tracking-[0.2em] uppercase text-sm font-bold group-hover:text-white transition-colors duration-300">GitHub Repository</span>
                </a>
            </div>

            {/* ZONE 3: THE TRANSMISSION TERMINAL */}
            <form ref={formRef} onSubmit={handleSubmit} className="absolute bottom-[10%] left-[5%] w-[400px] z-20 bg-black/60 backdrop-blur-md border border-white/10 p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                <div className="flex justify-between items-end mb-6">
                    <h3 className={`${cinzel.className} text-[#cc2222] text-lg font-bold tracking-widest`}>DIRECT PAYLOAD</h3>
                    <span className="text-white/30 text-[10px] font-bold tracking-[0.2em]">{formStatus}</span>
                </div>
                
                <div className="flex flex-col gap-4">
                    <input type="text" placeholder="IDENTIFICATION (NAME)" required className="bg-transparent border-b border-white/20 pb-2 text-white/90 text-sm tracking-widest uppercase focus:outline-none focus:border-[#cc2222] transition-colors placeholder:text-white/30" />
                    <input type="email" placeholder="FREQUENCY (EMAIL)" required className="bg-transparent border-b border-white/20 pb-2 text-white/90 text-sm tracking-widest uppercase focus:outline-none focus:border-[#cc2222] transition-colors placeholder:text-white/30" />
                    <textarea placeholder="PAYLOAD (MESSAGE)" required rows={3} className="bg-transparent border-b border-white/20 pb-2 text-white/90 text-sm tracking-widest uppercase focus:outline-none focus:border-[#cc2222] transition-colors placeholder:text-white/30 resize-none mt-2" />
                    
                    <button type="submit" className="mt-4 border border-[#cc2222]/50 text-[#cc2222] py-3 text-sm font-bold tracking-[0.3em] uppercase hover:bg-[#cc2222] hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(204,34,34,0.2)] hover:shadow-[0_0_20px_rgba(204,34,34,0.8)]">
                        [ INITIATE ]
                    </button>
                </div>
            </form>

            {/* WATERMARK NUMBER */}
            <div ref={watermarkRef} className="absolute bottom-[2%] left-[5%] z-10 pointer-events-none">
                <span className={`${cinzel.className} text-[14px] font-bold text-white/10 tracking-[0.5em]`}>STATUS: ENCRYPTED CHANNEL</span>
            </div>

            {/* ZONE 4: THE BEACON STAGE */}
            <div className="absolute top-0 right-[-10%] w-[1000px] h-screen flex items-center justify-center z-10 pointer-events-none">
                
                <div ref={stageRef} className="stage-circle absolute rounded-full bg-gradient-to-br from-[#1a0505] to-[#000000] shadow-[-50px_0_100px_rgba(20,0,0,0.9)] border-l border-[#cc2222]/20" style={{ width: '120vw', height: '120vw', right: '-60vw', top: 'calc(50vh - 60vw)' }} />

                <svg ref={ringRef} className="absolute w-[800px] h-[800px]" viewBox="0 0 500 500">
                    <defs><path id="contactTextPath" d="M 250, 250 m -220, 0 a 220,220 0 1,1 440,0 a 220,220 0 1,1 -440,0" /></defs>
                    <text fill="#ffffff" className={`${cinzel.className} text-[22px] tracking-[0.4em] uppercase`}>
                        <textPath href="#contactTextPath" startOffset="0%">Initiate Transmission  ✦  Initiate Transmission  ✦</textPath>
                    </text>
                    <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(204,34,34,0.3)" strokeWidth="1" />
                </svg>

                <div ref={assetRef} className="absolute z-20 w-[500px] h-[500px]">
                    <Image 
                        src="/contact-beacon.png" // The beacon you generate
                        alt="Resonance Beacon" 
                        fill 
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-contain drop-shadow-[0_0_60px_rgba(204,34,34,0.6)] animate-float" 
                    />
                </div>

                {/* Keeping the hands to hold/summon the beacon */}
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