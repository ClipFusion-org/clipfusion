"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ComponentProps, useEffect, useState } from "react";

const easeSlide = (x: number) => (
    1 - Math.pow(1 - x, 3)
);

export const SidebarTriggerAdjustable = (props: ComponentProps<"div">) => {
    const isMobile = useIsMobile();

    useEffect(() => {
        const triggerElement = document.querySelector('div[data-sidebar-trigger="true"]');

        const handleScroll = () => {
            if (!triggerElement) {
                console.log("triggerElement is null");
                return;
            }
            const triggerDiv = triggerElement as HTMLDivElement;
            const slideAmount = easeSlide(
                Math.max(0, Math.min(1, window.scrollY / (window.innerHeight / 20)))
            );
            triggerDiv.style.marginLeft = `calc(var(--spacing) *  ${12 * slideAmount})`;
            triggerDiv.style.paddingTop = `calc(var(--spacing) * ${(isMobile ? 1 : 3) * slideAmount})`;
        };

        window.addEventListener('scroll', handleScroll, {passive: true});

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isMobile]);

    return <div data-sidebar-trigger="true" {...props} className={cn("will-change-auto", props.className)}></div>;
}