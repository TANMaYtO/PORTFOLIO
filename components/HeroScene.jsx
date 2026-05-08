"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Cinzel, Space_Mono } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "700"] });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"] });

/**
 * Renders the full-screen Hero component with cinematic typography and parallax.
 * @returns {React.JSX.Element} The HeroScene component.
 */
export default function HeroScene() {
    const containerRef = useRef(null);
    const titleWrapperRef = useRef(null);
    const lightLayerRef = useRef(null);
    const subtitleRef = useRef(null);

    // Refs for GSAP zero-latency quickTo functions
    const xTo = useRef(null);
    const yTo = useRef(null);

    useGSAP(
        () => {
            // Soulsborne Boss Reveal Entrance Animation
            gsap.fromTo(
                titleWrapperRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 4, ease: "power2.out" }
            );

            gsap.fromTo(
                subtitleRef.current,
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 4, ease: "power2.out", delay: 2 }
            );

            // Initialize GSAP quickTo for ultra-smooth, zero-latency mouse tracking
            xTo.current = gsap.quickTo(lightLayerRef.current, "--mouse-x", { duration: 0.15, ease: "power3.out" });
            yTo.current = gsap.quickTo(lightLayerRef.current, "--mouse-y", { duration: 0.15, ease: "power3.out" });

            // Initialize Volumetric Light Layer opacity
            gsap.set(lightLayerRef.current, { opacity: 0 });

            // Native scroll intent transition (Fallback for Observer crash)
            let transitionTriggered = false;

            const executeTransition = () => {
                if (transitionTriggered) return;
                transitionTriggered = true;
                
                // Wake up the Eye component globally
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("startMenuTransition"));
                }
                
                const tl = gsap.timeline();
                tl.to(containerRef.current, { scale: 1.08, duration: 0.4, ease: "power2.in" });
                tl.to(containerRef.current, { scale: 0, opacity: 0, duration: 0.55, ease: "power4.in" }, "-=0.1");
                tl.to('#menu-screen', { zIndex: 20, duration: 0 });
                tl.fromTo('#menu-screen', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 0.7, ease: "power3.out" });
            };

            const handleWheel = (e) => {
                if (e.deltaY > 0) executeTransition();
            };

            let touchStartY = 0;
            const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
            const handleTouchMove = (e) => {
                if (touchStartY - e.touches[0].clientY > 40) executeTransition();
            };

            window.addEventListener("wheel", handleWheel);
            window.addEventListener("touchstart", handleTouchStart);
            window.addEventListener("touchmove", handleTouchMove);

            return () => {
                window.removeEventListener("wheel", handleWheel);
                window.removeEventListener("touchstart", handleTouchStart);
                window.removeEventListener("touchmove", handleTouchMove);
            };
        },
        { scope: containerRef }
    );

    /**
     * Handles mouse movement for True Z-Depth Parallax effect.
     */
    function handleMouseMove(e) {
        if (!containerRef.current) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Normalize coordinates from -1 to 1
        const xPos = (clientX / innerWidth) * 2 - 1;
        const yPos = (clientY / innerHeight) * 2 - 1;

        // Query all depth layers and shift them precisely based on their custom depth attribute
        const parallaxLayers = containerRef.current.querySelectorAll('.parallax-layer');
        parallaxLayers.forEach((layer) => {
            const depth = parseFloat(layer.getAttribute('data-depth')) || 0;
            gsap.to(layer, {
                x: xPos * 30 * depth,
                y: yPos * 15 * depth,
                duration: 0.8,
                ease: "power3.out",
                overwrite: "auto"
            });
        });
    }

    /**
     * Zero-latency physics: Maps local mouse coordinates to CSS variables via GSAP quickTo
     */
    function handleTitleMouseMove(e) {
        if (!titleWrapperRef.current || !xTo.current || !yTo.current) return;
        const rect = titleWrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        xTo.current(x);
        yTo.current(y);
    }

    /**
     * Volumetric Spotlight: Ignite the mask layer
     */
    function handleTitleMouseEnter() {
        gsap.to(lightLayerRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" });
    }

    /**
     * Volumetric Spotlight: Extinguish the mask layer
     */
    function handleTitleMouseLeave() {
        gsap.to(lightLayerRef.current, { opacity: 0, duration: 0.6, ease: "power2.out" });
    }

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="fixed inset-0 z-10 w-full h-screen overflow-hidden bg-black"
        >
            {/* Z-0: Background & Overall Overlay */}
            {/* Extended inset to prevent edge clipping during massive depth shifting */}
            <div className="absolute inset-[-5%] z-0 parallax-layer" data-depth="0.05">
                <Image
                    src="/ASSSETS/Backgrounds/city_night_2.png"
                    alt="City Night Background"
                    fill
                    unoptimized={true}
                    className="object-cover absolute inset-0 w-full h-full -z-10"
                    priority
                    style={{ imageRendering: "pixelated" }}
                />
            </div>
            <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none" />

            {/* Z-40: Soulsborne Boss Reveal Title with Volumetric Spotlight Hover Physics */}
            <div className="absolute top-[25%] left-1/2 -translate-x-1/2 z-40 text-center flex flex-col items-center pointer-events-none w-full parallax-layer" data-depth="0.05">
                
                {/* 3-Layer Component Wrapper */}
                <div
                    ref={titleWrapperRef}
                    onMouseMove={handleTitleMouseMove}
                    onMouseEnter={handleTitleMouseEnter}
                    onMouseLeave={handleTitleMouseLeave}
                    className="relative flex justify-center items-center cursor-crosshair pointer-events-auto opacity-0"
                >
                    {/* Layer 1 (The Base): Barely visible dark ghost text */}
                    <h1
                        className={`${cinzel.className} text-6xl md:text-7xl text-white/10 tracking-[0.5em]`}
                        style={{ marginLeft: '0.5em' }}
                    >
                        TANMAY TOMAR
                    </h1>
                    
                    {/* Layer 2 (The Glass Edge): 1px white stroke to outline the typography */}
                    <h1
                        className={`${cinzel.className} text-6xl md:text-7xl text-transparent absolute inset-0 tracking-[0.5em]`}
                        style={{ 
                            marginLeft: '0.5em', 
                            WebkitTextStroke: "1px rgba(255,255,255,0.15)" 
                        }}
                        aria-hidden="true"
                    >
                        TANMAY TOMAR
                    </h1>

                    {/* Layer 3 (The Volumetric Light): Illuminated drop-shadow layer masked by quickTo engine */}
                    <h1
                        ref={lightLayerRef}
                        className={`${cinzel.className} text-6xl md:text-7xl text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.8)] absolute inset-0 tracking-[0.5em]`}
                        style={{ 
                            marginLeft: '0.5em', 
                            maskImage: "radial-gradient(200px circle at calc(var(--mouse-x, 0) * 1px) calc(var(--mouse-y, 0) * 1px), white 0%, rgba(255, 165, 0, 0.8) 40%, transparent 100%)",
                            WebkitMaskImage: "radial-gradient(200px circle at calc(var(--mouse-x, 0) * 1px) calc(var(--mouse-y, 0) * 1px), white 0%, rgba(255, 165, 0, 0.8) 40%, transparent 100%)"
                        }}
                        aria-hidden="true"
                    >
                        TANMAY TOMAR
                    </h1>
                </div>

                <h2
                    ref={subtitleRef}
                    className={`${spaceMono.className} mt-6 text-sm text-orange-400/80 tracking-[0.3em] opacity-0 drop-shadow-[0_0_8px_rgba(255,165,0,0.5)]`}
                    style={{ marginLeft: '0.3em' }}
                >
                    THE LAEDDIS PROTOCOL
                </h2>
            </div>

            {/* Bottom Gradient Overlay to ground the scene perfectly */}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-black via-black/40 to-transparent z-[55] pointer-events-none" />

            {/* Z-60: UI Elements */}
            <div className={`absolute inset-x-0 bottom-[5%] z-[60] flex flex-col items-center justify-center text-white/90 animate-bounce pointer-events-auto opacity-80 ${spaceMono.className}`}>
                <span className="text-[10px] font-bold tracking-[0.3em] mb-1.5 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)] ml-[0.3em]">
                    Scroll Down
                </span>
                <svg
                    className="w-4 h-4 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    ></path>
                </svg>
            </div>
        </section>
    );
}
