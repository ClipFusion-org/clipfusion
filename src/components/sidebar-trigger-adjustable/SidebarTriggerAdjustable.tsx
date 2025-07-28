"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { ComponentProps, useEffect, useState } from "react";

const easeSlide = (x: number) => (
    1 - Math.pow(1 - x, 3)
);

const lerp = (a: number, b: number, t: number) => (
    a * t + b * (1 - t)
);


export const SidebarTriggerAdjustable = (props: ComponentProps<"div"> & {
    adjustWidth?: number | `${number}`
}) => {
    const adjustWidth = props.adjustWidth === undefined ? 12 : +props.adjustWidth;
    const isMobile = useIsMobile();
    const [slideAmount, setSlideAmount] = useState(0);

    useEffect(() => {
        const handleScroll = () =>
            setSlideAmount(easeSlide(
                Math.max(0, Math.min(1, window.scrollY / (window.innerHeight / 20)))
            ));

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile]);

    return <div style={{
        transform: `translateX(calc(var(--spacing) * ${adjustWidth * slideAmount}))`,
        marginTop: `calc(var(--spacing) * ${(isMobile ? 1 : 3) * slideAmount})`,
        width: `calc(100% - var(--spacing) * ${lerp(0, adjustWidth, 1 - slideAmount)})`
    }} className={props.className}>{props.children}</div>;
}