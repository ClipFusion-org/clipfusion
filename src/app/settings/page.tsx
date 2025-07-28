"use client";
import { ChartPieIcon, ChevronRightIcon, InfoIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import StaticSidebarTrigger from "@/components/static-sidebar-trigger";
import ScrollFadingTitle from "@/components/scroll-fading-title";
import SidebarTriggerAdjustable from "@/components/sidebar-trigger-adjustable";
import Search from "@/components/search";
import { useIsMobile } from "@/hooks/use-mobile";
import AscendingCard from "@/components/ascending-card";
import Link from "next/link";
import WideContainer from "@/components/wide-container";

export default function Settings(): ReactNode {
    const isMobile = useIsMobile();

    return (
        <div className="p-5 w-full h-full">
            <div className="flex flex-row items-center gap-2">
                <StaticSidebarTrigger />
                <ScrollFadingTitle>
                    <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Settings</h2>
                </ScrollFadingTitle>
            </div>
            <div className="flex flex-col sticky top-safe bg-background gap-2 mt-2 pb-2 pt-2 p-5 w-[100% + 5 * var(--spacing)] z-10 -mx-5">
                <SidebarTriggerAdjustable adjustWidth={!isMobile ? 0 : 12} className="flex items-center justify-center">
                    <WideContainer>
                        <Search />
                    </WideContainer>
                </SidebarTriggerAdjustable>
            </div>
            <div className="flex flex-col items-center w-full">
                <div className="flex flex-col gap-1 md:gap-2 mt-1 md:mt-2">
                    <WideContainer>
                        <Link href="/settings/storage">
                            <AscendingCard className="flex flex-row justify-between gap-2 p-4">
                                <div className="flex flex-row justify-between items-center gap-3">
                                    <div className="flex items-center justify-center">
                                        <ChartPieIcon />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <h3 className="font-semibold break-keep text-lg sm:text-xl">Storage</h3>
                                        <p className="text-sm text-muted-foreground">Memory usage, media, cache etc.</p>
                                    </div>
                                </div>
                                <ChevronRightIcon />
                            </AscendingCard>
                        </Link>
                    </WideContainer>
                    <p className="text-sm text-muted-foreground">Build ID: {process.env.BUILD_ID_ENV}</p>
                </div>

            </div>
        </div>
    );
}