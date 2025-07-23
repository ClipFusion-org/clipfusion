"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { usePersistenceContext } from "../persistence-provider";

function PersistentStorageControl({
    status
}: {
    status: string | null
}): ReactNode {
    const { persist } = usePersistenceContext();
    if (status == null || status == '') return <Label className="text-muted-foreground">No information</Label>;
    if (status == "never") return <Label className="text-red-500">Unavailable</Label>;
    if (status == "prompt") return <Button onClick={persist}>Enable</Button>;
    return <Label className="text-green-400">Enabled</Label>;
};

export default function Settings(): ReactNode {
    const [status, setStatus] = useState<string | null>('');

    useEffect(() => {
        setStatus(localStorage.getItem("persistence-status"));
    }, []);

    return (
        <div className="p-5 w-full">
            <div className="flex flex-row items-center gap-2">
                <SidebarTrigger/>
                <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Settings</h2>
            </div>
            <div className="flex flex-col gap-1 md:lg:gap-2 mt-2 md:mt-4 lg:mt-5">
                <h3 className="font-semibold break-keep text-lg sm:text-xl md:text-2xl lg:text-3xl leading-none">Storage</h3>
                <div className="">
                    <div className="flex flex-row justify-between items-center w-full max-w-96">
                        <div className="flex flex-row gap-2 items-center">
                            <Label>Persistent Storage</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <InfoIcon size="15" className="opacity-60 hover:opacity-80"/>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Persistent storage prevents browser from deleting your local data to free up space for other websites.
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <PersistentStorageControl status={status}/>
                    </div>
                </div>
            </div>
        </div>
    );
}