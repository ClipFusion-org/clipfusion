'use client';

import ClipFusionLogo from "@/components/clipfusion-logo";
import ThemeSwitcher from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menubar, MenubarItem, MenubarMenu, MenubarContent, MenubarTrigger, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarSeparator } from "@/components/ui/menubar";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function Editor() {
    const router = useRouter();
    const params = useParams();
    const uuid = params.uuid as string;
    const project = useLiveQuery(async () => db.projects.where('uuid').equals(uuid).first());
    const [projectTitle, setProjectTitle] = useState('');

    const handleRename = (e: ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setProjectTitle(title);
        db.projects.update(uuid, {
            title: title
        });
    };

    // Redirect user to the project library if provided UUID is invalid
    useEffect(() => {
        if (!uuid) {
            router.push('/');
            return;
        }
        if (project && projectTitle === '') {
            setProjectTitle(project.title);
        }
    }, [uuid, project]);

    return project ? (
        <>
            <div className="absolute top-0 left-0 bg-card w-screen h-screen pt-10">
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50}>Player</ResizablePanel>
                    <ResizableHandle/>
                    <ResizablePanel defaultSize={50}>Timeline</ResizablePanel>
                </ResizablePanelGroup>
            </div>
            <Menubar className="absolute top-0 left-0 px-5 bg-white dark:bg-black flex flex-row m-auto justify-between w-full rounded-none z-50 h-10">
                <div className="flex flex-row justify-begin grow basis-0 items-center gap-4">
                    <Link href="/" prefetch={false}>
                        <ClipFusionLogo width="16" height="16" />
                    </Link>
                    <MenubarMenu>
                        <MenubarTrigger className="group" asChild>
                            <Button variant="ghost" className="p-0 [&>svg]:group-data-[state='open']:rotate-180 gap-1 hover:bg-none">
                                Menu <ChevronDownIcon className="text-muted-foreground" size={15} />
                            </Button>
                        </MenubarTrigger>
                        <MenubarContent>
                            <MenubarSub>
                                <MenubarSubTrigger>
                                    File
                                </MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem>
                                        New Project
                                    </MenubarItem>
                                    <MenubarItem>
                                        Open Project
                                    </MenubarItem>
                                    <MenubarSub>
                                        <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
                                        <MenubarSubContent>
                                            Hello!
                                        </MenubarSubContent>
                                    </MenubarSub>
                                </MenubarSubContent>
                            </MenubarSub>
                            <MenubarSeparator/>
                            <MenubarItem onClick={() => router.push('/')}>Back to Project Library</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </div>
                <div className="flex flex-row justify-center grow basis-0">
                    <Input placeholder="Project Title" spellCheck={false} value={projectTitle} onChange={(e) => handleRename(e)} className="bg-transparent dark:bg-transparent border-none focus-visible:ring-0 text-sm p-0 h-6 text-center drop-shadow-none shadow-none font-semibold text-secondary-foreground"/>
                </div>
                <div className="flex flex-row justify-end grow basis-0">
                    <ThemeSwitcher variant="transparent"/>
                </div>
            </Menubar>
        </>
    ) : (
        <div className="flex items-center justify-center w-screen h-screen">
            <ClipFusionLogo width="100" height="100"/>
        </div>
    );
}