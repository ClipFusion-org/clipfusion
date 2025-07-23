"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ReactNode } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ListIcon, PlusIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import Search from "@/components/search";
import { useIsMobile } from "@/hooks/use-mobile";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

const Project = (): ReactNode => {
    return (
        <AspectRatio ratio={16 / 9}>
            <Card className=" rounded-lg shadow-md p-4 w-full h-full overflow-hidden">
                <h3 className="text-lg font-semibold">Project Title</h3>
                <p className="text-sm text-gray-600">Project description goes here.</p>
            </Card>
        </AspectRatio>
    )
};

export default function Home(): ReactNode {
    const isMobile = useIsMobile();

    const projectsCount = useLiveQuery(() => {
        return db.projects.count();
    });

    return (
        <div className="p-5 w-full">
            <div className="flex flex-row items-center gap-2">
                <SidebarTrigger size="lg"/>
                <h2 className="font-bold break-keep text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-none">Project Library</h2>
                <Label className="text-muted-foreground text-sm">(Found {projectsCount != undefined ? projectsCount : '-'} projects)</Label>
            </div>
            <div className="flex flex-row items-center justify-between sticky top-0 bg-background gap-2 mt-3 pb-2 pt-2 w-full overscroll-none z-50">
                <div className="flex flex-row items-center gap-2">
                    <Button>
                        <PlusIcon/> {!isMobile && "New Project"}
                    </Button>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <Toggle variant="outline">
                        <ListIcon/> {!isMobile && "Select Projects"}
                    </Toggle>
                    <Search placeholder="Search Projects"/>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
                <Project/>
                <Project/>
                <Project/>
                <Project/>
                <Project/>
                <Project/>
            </div>
        </div>
    );
};
