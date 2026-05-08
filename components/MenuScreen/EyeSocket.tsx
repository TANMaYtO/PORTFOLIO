"use client";

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import type { Ref } from 'react';

export interface EyeSocketHandle {
    container: HTMLDivElement | null;
    pulseRing: SVGCircleElement | null;
}

// Scalloped inner edge path (bottom→top, cusps point RIGHT toward eye)
const INNER_EDGE = [
    "M 200 288",
    "Q 190 280, 178 268", // valley 1
    "Q 190 258, 198 248", // cusp 1
    "Q 186 238, 170 230", // valley 2
    "Q 182 220, 197 210", // cusp 2
    "Q 185 200, 166 192", // valley 3
    "Q 178 182, 196 172", // cusp 3
    "Q 184 162, 172 153", // valley 4
    "Q 180 143, 198 133", // cusp 4
    "Q 196 126, 200 115", // close to top
].join(" ");

// Full shell outline: outer smooth curve + inner scalloped edge
const SHELL_PATH = [
    "M 200 115",
    "C 148 82, 72 140, 68 200",   // outer top → left bulge
    "C 64 268, 148 315, 200 288", // outer left → bottom
    INNER_EDGE.replace("M 200 288", "L 200 288"), // scalloped inner edge going up
    "Z",
].join(" ");

// Just the inner edge as open stroke (for rim lighting)
const RIM_PATH = INNER_EDGE;

const EyeSocket = forwardRef(function EyeSocket(
    _props: Record<string, never>,
    ref: Ref<EyeSocketHandle>
) {
    const containerRef = useRef<HTMLDivElement>(null);
    const pulseRingRef = useRef<SVGCircleElement>(null);

    useImperativeHandle(ref, () => ({
        get container() { return containerRef.current; },
        get pulseRing() { return pulseRingRef.current; },
    }));

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: '94%',
                left: '5%',
                width: '320px',
                height: '320px',
                zIndex: 45,
                opacity: 0,
            }}
        >
            <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                    {/* Shell body gradient — dark chitin */}
                    <radialGradient id="shellGrad" cx="38%" cy="35%" r="65%">
                        <stop offset="0%" stopColor="#1a1b22" />
                        <stop offset="60%" stopColor="#111216" />
                        <stop offset="100%" stopColor="#0d0e12" />
                    </radialGradient>
                    {/* Horn light face */}
                    <linearGradient id="hornLight" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#4a4c54" />
                        <stop offset="50%" stopColor="#8a8d98" />
                        <stop offset="100%" stopColor="#5a5c65" />
                    </linearGradient>
                    {/* Horn dark face */}
                    <linearGradient id="hornDark" x1="100%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#1a1b20" />
                        <stop offset="100%" stopColor="#111216" />
                    </linearGradient>
                    {/* Rim blur */}
                    <filter id="rimBlur">
                        <feGaussianBlur stdDeviation="1.2" />
                    </filter>
                    {/* Soft glow for pulse */}
                    <filter id="pulseGlow">
                        <feGaussianBlur stdDeviation="4" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                </defs>

                {/* ══════ BACK LAYER: HORNS ══════ */}

                {/* HORN 1 — Upper-right (longest) */}
                <g>
                    <path d="M 185 132 C 220 105, 290 55, 345 12 L 195 125 Z"
                          fill="url(#hornDark)" />
                    <path d="M 205 118 C 240 92, 300 48, 345 12 L 195 125 Z"
                          fill="url(#hornLight)" />
                    <path d="M 195 125 C 230 98, 295 52, 345 12"
                          stroke="#ffffff" strokeWidth="1" fill="none" />
                </g>

                {/* HORN 2 — Upper (medium, nearly vertical) */}
                <g>
                    <path d="M 128 152 C 125 110, 145 45, 155 -20 L 138 142 Z"
                          fill="url(#hornDark)" />
                    <path d="M 148 132 C 150 95, 160 35, 155 -20 L 138 142 Z"
                          fill="url(#hornLight)" />
                    <path d="M 138 142 C 140 102, 152 40, 155 -20"
                          stroke="#ffffff" strokeWidth="1" fill="none" />
                </g>

                {/* HORN 3 — Upper-left (medium-long) */}
                <g>
                    <path d="M 95 195 C 70 168, 30 105, 15 40 L 85 180 Z"
                          fill="url(#hornDark)" />
                    <path d="M 75 165 C 58 140, 25 90, 15 40 L 85 180 Z"
                          fill="url(#hornLight)" />
                    <path d="M 85 180 C 65 152, 28 95, 15 40"
                          stroke="#ffffff" strokeWidth="1" fill="none" />
                </g>

                {/* ══════ MIDDLE LAYER: SCALLOPED SHELL ══════ */}
                <path d={SHELL_PATH} fill="url(#shellGrad)" />

                {/* Shell surface detail — subtle armor-plate cracks */}
                <path d="M 130 160 Q 115 185, 120 215" stroke="#08090e" strokeWidth="0.8" fill="none" />
                <path d="M 100 200 Q 105 230, 125 255" stroke="#08090e" strokeWidth="0.6" fill="none" />
                <path d="M 155 135 Q 140 155, 135 180" stroke="#0a0b10" strokeWidth="0.5" fill="none" />

                {/* ══════ FRONT LAYER: RIM LIGHTING ══════ */}
                {/* Bright white rim on scalloped inner edge */}
                <path d={RIM_PATH}
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="2.5"
                      fill="none"
                      filter="url(#rimBlur)"
                      strokeLinecap="round"
                />
                {/* Sharper inner highlight */}
                <path d={RIM_PATH}
                      stroke="rgba(255,255,255,0.3)"
                      strokeWidth="1"
                      fill="none"
                      strokeLinecap="round"
                />

                {/* Outer edge subtle highlight */}
                <path d="M 200 115 C 148 82, 72 140, 68 200"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="2"
                      fill="none"
                />

                {/* ══════ PULSE RING (animated by parent) ══════ */}
                <circle
                    ref={pulseRingRef}
                    cx="200" cy="200" r="55"
                    fill="none"
                    stroke="rgba(139,0,0,0)"
                    strokeWidth="3"
                    filter="url(#pulseGlow)"
                />
            </svg>
        </div>
    );
});

export default EyeSocket;
