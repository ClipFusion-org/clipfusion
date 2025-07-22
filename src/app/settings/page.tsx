import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function Settings(): ReactNode {
    return (
        <div className="p-5">
            <div className="flex flex-row items-center gap-2">
                <SidebarTrigger/>
                <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Settings</h2>
            </div>
        </div>
    );
}