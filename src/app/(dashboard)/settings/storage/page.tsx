"use client";
import { usePersistenceContext } from "@/app/persistence-provider";
import AscendingCard from "@/components/ascending-card";
import ScrollFadingTitle from "@/components/scroll-fading-title";
import Search from "@/components/search";
import SidebarTriggerAdjustable from "@/components/sidebar-trigger-adjustable";
import StaticSidebarTrigger from "@/components/static-sidebar-trigger";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useSidebar } from "@/components/ui/sidebar";
import WideContainer from "@/components/wide-container";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

function PersistentStorageControl({
    status
}: {
    status: string | null
}): ReactNode {
    const { persist } = usePersistenceContext();
    if (status == null) return <Label className="text-muted-foreground">No information</Label>;
    if (status == "never") return <Label className="text-red-500">Unavailable</Label>;
    if (status == "prompt") return <Button onClick={persist}>Enable</Button>;
    return <Label className="text-green-400">Enabled</Label>;
};

export default function Storage() {
    const [status, setStatus] = useState<string | null>(null);
    const router = useRouter();
    const isMobile = useIsMobile();

    useEffect(() => {
        setStatus(localStorage.getItem("persistence-status"));
    }, []);

    return (
        <div className="p-5 w-full">
            <div className="flex flex-row items-center gap-2">
                <StaticSidebarTrigger>
                    <Button className="fixed size-7 ml-10 z-40 transition-colors" variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeftIcon />
                    </Button>
                </StaticSidebarTrigger>
                <ScrollFadingTitle className="flex flex-row items-center">
                    <div className="ml-10" />
                    <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Storage</h2>
                </ScrollFadingTitle>
            </div>
            <div className="flex flex-col sticky top-safe bg-background gap-2 mt-2 pb-2 pt-2 p-5 w-[100% + 5 * var(--spacing)] z-10 -mx-5">
                <SidebarTriggerAdjustable adjustWidth={!isMobile ? 0 : 22} className="flex items-center justify-center">
                    <WideContainer>
                        <Search />
                    </WideContainer>
                </SidebarTriggerAdjustable>
            </div>
            <div className="flex flex-col items-center justify-start gap-1 md:lg:gap-2 mt-2">
                <WideContainer>
                    <AscendingCard className="flex flex-row justify-between items-center p-4">
                        <div className="flex flex-row gap-2 ">
                        <Label>Persistent Storage</Label>
                    </div>
                    <PersistentStorageControl status={status} />
                    </AscendingCard>
                </WideContainer>
            </div>
        </div>
    )
}