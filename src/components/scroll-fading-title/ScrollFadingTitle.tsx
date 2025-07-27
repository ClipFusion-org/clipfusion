import { cn } from "@/lib/utils";
import { ComponentProps, useEffect, useRef, useState } from "react";

const easeFade = (x: number) => (
    x === 0 ? 0 : Math.pow(2, 10 * x - 10)
);

export const ScrollFadingTitle = (props: ComponentProps<"div">) => {
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (!elementRef.current) return;
            const opacity = easeFade(
                Math.max(0, Math.min(1, 1 - (window.scrollY / (window.innerHeight / 20))))
            );
            elementRef.current.style.opacity = `${opacity}`;
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [elementRef]);

    return <div style={{opacity: 1}} ref={elementRef} {...props} className={cn("will-change-auto", props.className)}/>
};