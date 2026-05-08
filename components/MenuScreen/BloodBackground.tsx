"use client";

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import type { Ref } from 'react';

export interface BloodBackgroundHandle {
    /** Triggers the blood flood animation from the bottom-left origin. */
    startFlood: () => void;
}

const BloodBackground = forwardRef(function BloodBackground(
    _props: Record<string, never>,
    ref: Ref<BloodBackgroundHandle>
) {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        startFlood() {
            if (!containerRef.current) return;
            gsap.to(containerRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
            gsap.to(containerRef.current, {
                clipPath: 'circle(160% at 5% 94%)',
                duration: 1.4,
                ease: "power2.out",
            });
        },
    }));

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 pointer-events-none"
            style={{
                zIndex: 1,
                opacity: 0,
                clipPath: 'circle(0% at 5% 94%)',
            }}
        >
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter
                        id="bloodTexture"
                        x="0%"
                        y="0%"
                        width="100%"
                        height="100%"
                        colorInterpolationFilters="sRGB"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.68 0.72"
                            numOctaves={4}
                            seed={8}
                            stitchTiles="stitch"
                            result="noise"
                        />
                        <feColorMatrix
                            type="matrix"
                            values="0.25 0    0    0    0.08
                                    0    0    0    0    0
                                    0    0    0    0    0.01
                                    0    0    0    1.8  -0.6"
                            result="coloredNoise"
                        />
                        <feBlend in="coloredNoise" in2="SourceGraphic" mode="multiply" />
                    </filter>
                </defs>
                <rect
                    width="100%"
                    height="100%"
                    fill="#0d0105"
                    filter="url(#bloodTexture)"
                    opacity="0.92"
                />
            </svg>
        </div>
    );
});

export default BloodBackground;
