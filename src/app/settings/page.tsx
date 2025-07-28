"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChartPieIcon, InfoIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { usePersistenceContext } from "../persistence-provider";
import StaticSidebarTrigger from "@/components/static-sidebar-trigger";
import ScrollFadingTitle from "@/components/scroll-fading-title";
import SidebarTriggerAdjustable from "@/components/sidebar-trigger-adjustable";
import Search from "@/components/search";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import AscendingCard from "@/components/ascending-card";
import Link from "next/link";

export default function Settings(): ReactNode {
    const isMobile = useIsMobile();

    const SearchContainer = isMobile ? "div" : SidebarTriggerAdjustable;
    const cardWidth = isMobile ? "w-full" : "w-2xl";

    return (
        <div className="p-5 w-full h-full">
            <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                    <StaticSidebarTrigger />
                    <ScrollFadingTitle>
                        <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Settings</h2>
                    </ScrollFadingTitle>
                </div>
                <div className="flex flex-col sticky top-safe bg-background gap-2 mt-2 pb-2 pt-2 p-5 w-[100% + 5 * var(--spacing)] z-10 -mx-5">
                    <SearchContainer className={cn("flex justify-center",)}>
                        <Search placeholder="Search Settings" className={cardWidth} />
                    </SearchContainer>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center w-full gap-1 md:lg:gap-2 mt-2">
                <Link href="/settings/storage" className="w-full flex items-center justify-center">
                    <AscendingCard className={`flex flex-row gap-3 p-3 ${cardWidth}`}>
                        <div className="flex items-center justify-center">
                            <ChartPieIcon />
                        </div>
                        <div className="flex flex-col items-start">
                            <h3 className="font-semibold break-keep text-lg sm:text-xl">Storage</h3>
                            <p className="text-sm text-secondary-foreground">Memory usage, media, cache etc.</p>
                        </div>
                    </AscendingCard>
                </Link>
            </div>
        </div>
    );
}