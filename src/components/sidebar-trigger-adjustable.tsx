"use client";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ComponentProps, useEffect, useRef } from "react";

const easeSlide = (x: number) => (
    1 - Math.pow(1 - x, 3)
);

const lerp = (a: number, b: number, t: number) => (
    a * t + b * (1 - t)
);

const SidebarTriggerAdjustable = (props: ComponentProps<"div"> & {
    adjustWidth?: number | `${number}`
}) => {
    const adjustWidth = props.adjustWidth === undefined ? 12 : +props.adjustWidth;
    const isMobile = useIsMobile();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let lastKnownScrollPosition = 0;
        let ticking = false;

        const updateAdjustable = (scrollPos: number) => {
            if (!ref.current) return;
            const slideAmount = easeSlide(
                Math.max(0, Math.min(1, scrollPos / (window.innerHeight / 20))));

            ref.current.style.transform = `translateX(calc(var(--spacing) * ${adjustWidth * slideAmount}))`;
            ref.current.style.width = `calc(100% - var(--spacing) * ${lerp(0, adjustWidth, 1 - slideAmount)})`;
        };

        const handleScroll = () => {
            lastKnownScrollPosition = window.scrollY;

            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateAdjustable(lastKnownScrollPosition);
                    ticking = false;
                });

                ticking = true;
            }
        }

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile, ref]);

    return <div ref={ref} className={props.className}>{props.children}</div>;
}

export default SidebarTriggerAdjustable;