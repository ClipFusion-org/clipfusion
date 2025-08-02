'use client';

import ClipFusionLogo from "@/components/clipfusion-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menubar, MenubarItem, MenubarMenu, MenubarContent, MenubarTrigger, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarSeparator } from "@/components/ui/menubar";
import { db } from "@/lib/db";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronDownIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Editor() {
    const router = useRouter();
    const params = useParams();
    const uuid = params.uuid as string;
    const project = useLiveQuery(async () => db.projects.where('uuid').equals(uuid).first());
    const [projectTitle, setProjectTitle] = useState('');

    // Redirect user to the project library if provided UUID is invalid
    useEffect(() => {
        if (!uuid || (!project && project !== undefined)) {
            router.push('/');
            return;
        }
        if (project && projectTitle === '') {
            setProjectTitle(project.title);
        }
    }, [uuid, project]);

    return project ? (
        <>
            <div className="absolute top-0 left-0 bg-secondary w-screen h-screen pt-9">
                Hello, World!
            </div>
            <Menubar className="absolute top-0 left-0 px-5 bg-card flex flex-row m-auto justify-between w-screen rounded-none">
                <div className="flex flex-row justify-begin grow basis-0 items-center gap-4">
                    <ClipFusionLogo width="16" height="16" />
                    <MenubarMenu>
                        <MenubarTrigger className="group" asChild>
                            <Button variant="ghost" className="p-0 [&>svg]:group-data-[state='open']:rotate-180 gap-1">
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
                    <Input placeholder="Project Title" spellCheck={false} value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)} className="bg-transparent dark:bg-transparent border-none focus-visible:ring-0 text-sm p-0 h-6 text-center"/>
                </div>
                <div className="flex flex-row justify-end grow basis-0" />
            </Menubar>
        </>
    ) : <>Project is invalid (or is it?)</>;
}