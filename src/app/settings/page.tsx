import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";

export default function Settings(): ReactNode {
    return (
        <div className="p-5">
            <div className="flex flex-row items-center gap-2">
                <SidebarTrigger/>
                <h1 className="text-4xl font-bold">Settings</h1>
            </div>
        </div>
    );
}