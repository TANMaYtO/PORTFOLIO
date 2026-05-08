"use client";

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import type { Ref } from 'react';

export interface EyeHubHandle {
    /** The fixed anchor wrapper. */
    container: HTMLDivElement | null;
}

const EyeHub = forwardRef(function EyeHub(
    _props: Record<string, never>,
    ref: Ref<EyeHubHandle>
) {
    const hubRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
        get container() { return hubRef.current; },
    }));

    return (
        <div
            ref={hubRef}
            className="fixed bottom-[0px] left-[-5px] w-[350px] h-[350px] z-50"
            style={{ opacity: 0 }}
        >
            {/* Armor PNG only — the Eye component lives separately */}
            <Image
                src="/eye-armor.png"
                alt="Eye Armor"
                fill
                className="object-contain pointer-events-none z-10"
                unoptimized
            />
        </div>
    );
});

export default EyeHub;
