"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ComponentProps, useEffect, useState } from "react";

const easeSlide = (x: number) => (
    x
);

export const SidebarTriggerAdjustable = (props: ComponentProps<"div">) => {
    const [scrollY, setScrollY] = useState(0);
    const [windowHeight, setWindowHeight] = useState(1);
    const isMobile = useIsMobile();

    let ticking = false;

    useEffect(() => {
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    setScrollY(window.scrollY);
                    ticking = false;
                });
            }
        };
        const handleResize = () => setWindowHeight(window.innerHeight);
        
        setWindowHeight(window.innerHeight);

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    let slideAmount = Math.max(0, Math.min(1, scrollY / (windowHeight / 20)));
    slideAmount = easeSlide(slideAmount);

    return <div {...props} style={{
        marginLeft: `calc(var(--spacing) *  ${12 * slideAmount})`,
        marginTop:  `calc(var(--spacing) * ${(isMobile ? 1 : 3) * slideAmount})`
    }}></div>;
}