"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Label } from "@/components/ui/label";

export default function Home(): ReactNode {
    const projectsCount = useLiveQuery(() => {
        return db.projects.count();
    });

    return (
        <div className="p-5">
            <div className="flex flex-row items-center gap-2">
                <SidebarTrigger size="lg"/>
                <h2 className="font-bold text-4xl">Project Library</h2>
                <Label className="text-muted-foreground text-sm">(Found {projectsCount != undefined ? projectsCount : '-'} projects)</Label>
            </div>
        </div>
    );
};
