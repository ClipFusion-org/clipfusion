"use client";
import { ChartPieIcon, ChevronRightIcon } from "lucide-react";
import { ReactNode,  } from "react";
import StaticSidebarTrigger from "@/components/static-sidebar-trigger";
import ScrollFadingTitle from "@/components/scroll-fading-title";
import SidebarTriggerAdjustable from "@/components/sidebar-trigger-adjustable";
import Search from "@/components/search";
import { useIsMobile } from "@/hooks/use-mobile";
import AscendingCard from "@/components/ascending-card";
import Link from "next/link";
import WideContainer from "@/components/wide-container";
import { getBuildID, getVersion } from "@/lib/build";


export default function Settings(): ReactNode {
    const isMobile = useIsMobile();
    const shortBuildId = useIsMobile(1024);
    const buildID = getBuildID();

    return (
        <div className="p-5 w-full h-full">
            <div className="flex flex-row items-center gap-2">
                <StaticSidebarTrigger />
                <ScrollFadingTitle>
                    <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Settings</h2>
                </ScrollFadingTitle>
            </div>
            <div className="flex flex-col sticky top-safe bg-background gap-2 pb-2 pt-4 p-5 w-[100% + 5 * var(--spacing)] z-10 -mx-5">
                <SidebarTriggerAdjustable adjustWidth={!isMobile ? 0 : 12} className="flex items-center justify-center">
                    <WideContainer>
                        <Search />
                    </WideContainer>
                </SidebarTriggerAdjustable>
            </div>
            <div className="flex flex-col justify-start items-center h-screen">
                <WideContainer>
                    <div className="flex flex-col gap-2 mt-2 justify-center">
                        <Link href="/settings/storage">
                            <AscendingCard className="flex flex-row justify-between items-center gap-2 p-4">
                                <div className="flex flex-row justify-between items-center gap-3">
                                    <div className="flex items-center justify-center">
                                        <ChartPieIcon />
                                    </div>
                                    <div className="flex flex-col items-start">
                                        <h3 className="font-semibold break-keep text-lg sm:text-xl">Storage</h3>
                                        <p className="text-sm text-muted-foreground leading-none">Memory usage, media, cache etc.</p>
                                    </div>
                                </div>
                                <ChevronRightIcon />
                            </AscendingCard>
                        </Link>
                        <Link className="text-sm text-muted-foreground flex justify-center" target="_blank" href={
                            `https://github.com/ClipFusion-org/clipfusion/commit/${buildID}`
                        }>
                            {getVersion()} ({shortBuildId ? buildID?.slice(0, 7) : buildID})
                        </Link>
                    </div>
                </WideContainer>
            </div>
        </div>
    );
}