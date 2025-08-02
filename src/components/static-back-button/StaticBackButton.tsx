"use client";
import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const easeSlide = (x: number) => (
    1 - Math.pow(1 - x, 3)
);

export const StaticBackButton = () => {
    const isMobile = useIsMobile();
    const router = useRouter();
    const adjustHeight = isMobile ? -1 : 1;
    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        let lastKnownScrollPosition = 0;
        let ticking = false;

        const updateAdjustable = (scrollPos: number) => {
            if (!ref.current) return;
            const slideAmount = easeSlide(
                Math.max(0, Math.min(1, scrollPos / (window.innerHeight / 20))));

            ref.current.style.transform = `translateY(calc(var(--spacing) * ${adjustHeight * -slideAmount}))`;
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

    return (
        <>
            <div className="w-10 h-full" />
            <div className="absolute top-0 left-0 pl-6 pt-4 md:p-6 overscroll-auto">
                <Button ref={ref} className="fixed size-7 ml-10 z-40 transition-colors" variant="ghost" size="icon" onClick={() => router.back()} tabIndex={1}>
                    <ArrowLeftIcon />
                </Button>
            </div>
        </>
    );
};