"use client";
import { ChartPieIcon, ChevronRightIcon, ExternalLinkIcon } from "lucide-react";
import { ReactNode, useState, } from "react";
import StaticSidebarTrigger from "@/components/static-sidebar-trigger";
import ScrollFadingTitle from "@/components/scroll-fading-title";
import SidebarTriggerAdjustable from "@/components/sidebar-trigger-adjustable";
import Search from "@/components/search";
import { useIsMobile } from "@/hooks/useIsMobile";
import AscendingCard from "@/components/ascending-card";
import Link from "next/link";
import WideContainer from "@/components/wide-container";
import { getBuildID, getVersion } from "@/lib/build";
import useBrowserEngine from "@/hooks/useBrowserEngine";
import useUserAgent from "@/hooks/useUserAgent";
import StickyTopContainer from "@/components/sticky-top-container";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const BuildInfo = () => {
    const shortBuildId = useIsMobile(1024);
    const isMobile = useIsMobile();
    const buildID = getBuildID();

    const openGitHub = () => {
        window.open(`https://github.com/ClipFusion-org/clipfusion/commit/${buildID}`, '_blank')
    };

    const openGitMirror = () => {
        window.open(buildID === 'main'
            ? `https://git.clipfusion.org/ClipFusion-org/clipfusion/commits/branch/main`
            : `https://git.clipfusion.org/ClipFusion-org/clipfusion/commit/${buildID}`, '_blank');
    };

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger>
                    <p className="cursor-pointer flex flex-row items-center gap-1 hover:scale-[101%] duration-100">
                        <ExternalLinkIcon size={15} /> {getVersion()} ({shortBuildId ? buildID?.slice(0, 7) : buildID})
                    </p>
                </SheetTrigger>
                <SheetContent side="bottom" className="px-safe-or-2 pb-safe-or-2">
                    <SheetHeader className="w-[95%]">
                        <SheetTitle>Open in</SheetTitle>
                    </SheetHeader>
                    <div className="-mt-3">
                        <SheetClose asChild>
                            <Button variant="ghost" className="justify-start w-full" onClick={openGitHub}>
                                <Image src="/github-mark.svg" aria-hidden width="15" height="15" alt="ClipFusion GitHub" className="dark:invert" />
                                GitHub
                            </Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button variant="ghost" className="justify-start w-full" onClick={openGitMirror}>
                                <Image src="/clipfusion-git-logo.png" aria-hidden width="15" height="15" alt="ClipFusion Git Mirror" className="duration-100 hover:opacity-95 active:scale-95" />
                                ClipFusion Git Mirror
                            </Button>
                        </SheetClose>
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <p className="cursor-pointer flex flex-row items-center gap-1 hover:scale-[101%] duration-100">
                    <ExternalLinkIcon size={15} /> {getVersion()} ({shortBuildId ? buildID?.slice(0, 7) : buildID})
                </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={openGitHub}>
                    <Image src="/github-mark.svg" aria-hidden width="15" height="15" alt="ClipFusion GitHub" className="dark:invert" />
                    Open in GitHub
                </DropdownMenuItem>
                <DropdownMenuItem onClick={openGitMirror}>
                    <Image src="/clipfusion-git-logo.png" aria-hidden width="15" height="15" alt="ClipFusion Git Mirror" className="duration-100 hover:opacity-95 active:scale-95" />
                    Open in ClipFusion Git
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
};

export default function Settings(): ReactNode {
    const [showUserAgent, setShowUserAgent] = useState(false);
    const isMobile = useIsMobile();

    const browserEngine = useBrowserEngine();
    const userAgent = useUserAgent();

    return (
        <div className="p-5 w-full h-full">
            <div className="flex flex-row items-center gap-2">
                <StaticSidebarTrigger />
                <ScrollFadingTitle>
                    <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Settings</h2>
                </ScrollFadingTitle>
            </div>
            <StickyTopContainer>
                <SidebarTriggerAdjustable adjustWidth={!isMobile ? 0 : 12} className="flex items-center justify-center">
                    <WideContainer>
                        <Search />
                    </WideContainer>
                </SidebarTriggerAdjustable>
            </StickyTopContainer>
            <div className="flex flex-col justify-start items-center">
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
                        <div className="flex flex-col justify-center items-center text-center w-full text-sm text-muted-foreground">
                            <BuildInfo />
                            <p className="cursor-pointer" onClick={() => setShowUserAgent(!showUserAgent)}>{showUserAgent ? userAgent : `running on ${browserEngine}`}</p>
                        </div>
                    </div>
                </WideContainer>
            </div>
        </div>
    );
}