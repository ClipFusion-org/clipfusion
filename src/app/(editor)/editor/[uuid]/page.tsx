'use client';

import ClipFusionLogo from "@/components/clipfusion-logo";
import { PanelContainer } from "@/components/editor/panels/panel";
import PlayerPanel from "@/components/editor/panels/player-panel";
import { PropertiesPanel } from "@/components/editor/panels/properties-panel/PropertiesPanel";
import TimelinePanel from "@/components/editor/panels/timeline-panel";
import ThemeSwitcher from "@/components/theme-switcher";
import { Description, Title } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Menubar, MenubarItem, MenubarMenu, MenubarContent, MenubarTrigger, MenubarSub, MenubarSubContent, MenubarSubTrigger, MenubarSeparator } from "@/components/ui/menubar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/useIsMobile";
import { ProjectRenameForm, ProjectRenameFormFields, useProjectRenameForm } from "@/hooks/useProjectRenameForm";
import useRendering from "@/hooks/useRendering";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/store/useEditorStore";
import { defaultCanvasData } from "@/types/CanvasData";
import { defaultPlaybackData } from "@/types/PlaybackData";
import { defaultProject } from "@/types/Project";
import { useLiveQuery } from "dexie-react-hooks";
import { ChevronDownIcon, PencilIcon } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const ProjectRenamePopover = ({
    className
}: {
    className: string
}) => {
    const project = useEditorStore((state) => state.project);
    const setProject = useEditorStore((state) => state.setProject);
    const [open, setOpen] = React.useState(false);
    const form = useProjectRenameForm();

    const onRename = (values: ProjectRenameForm) => {
        setProject((prev) => ({
            ...prev,
            title: values.title,
            description: values.description
        }));
        setOpen(false);
    };

    const resetForm = () => {
        form.reset({
            title: project.title,
            description: project.description
        });
        setOpen(false);
    };

    React.useEffect(() => {
        resetForm();
    }, [project]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" className={className}>
                    <p className="truncate">{project?.title}</p> <PencilIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={cn("grid gap-2", className)}>
                <div className="grid">
                    <Title>
                        Rename Project
                    </Title>
                    <Description>
                        Change title and description of your project
                    </Description>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onRename)} className="grid gap-2">
                        <ProjectRenameFormFields form={form} />
                        <div className="flex items-center justify-end w-full gap-2">
                            <Button variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </PopoverContent>
        </Popover>
    );
}

export default function Editor() {
    const { setProject, setCanvasData, setPlaybackData, project } = useEditorStore();
    const router = useRouter();
    const params = useParams();
    const isMobile = useIsMobile();
    const uuid = params.uuid as string;
    const projectQuery = useLiveQuery(async () => db.projects.where('uuid').equals(uuid).first());

    // setting global data to the default values just in case
    React.useEffect(() => {
        // Initialize only if unset to avoid overriding PlayerPanel initialization.
        setPlaybackData((prev) => prev ?? defaultPlaybackData);
        setCanvasData((prev) =>
            (prev?.canvas && prev?.ctx) ? prev : defaultCanvasData
        );
        // set* from Zustand are stable; adding as deps satisfies exhaustive-deps.
    }, [setPlaybackData, setCanvasData]);

    // Redirect user to the project library if provided UUID is invalid
    React.useEffect(() => {
        if (!uuid) {
            router.push('/');
            return;
        }
        if (projectQuery) {
            // making sure we don't get undefined values
            setProject({
                ...defaultProject,
                ...projectQuery
            });
        }
    }, [projectQuery]);

    // Automatically save changes to the project
    React.useEffect(() => {
        db.projects.update(project.uuid, project);
    }, [project]);

    useRendering();

    return projectQuery ? (
        <>
            <PanelContainer className="absolute top-0 left-0 w-screen h-full pt-8 bg-panel-border rounded-none">
                <ResizablePanelGroup direction="vertical">
                    <ResizablePanel defaultSize={50}>
                        <ResizablePanelGroup direction="horizontal">
                            <PlayerPanel defaultSize={80} />
                            <ResizableHandle />
                            <PropertiesPanel />
                        </ResizablePanelGroup>
                    </ResizablePanel>
                    <ResizableHandle />
                    <TimelinePanel />
                </ResizablePanelGroup>
            </PanelContainer>
            <Menubar className="absolute top-0 left-0 bg-panel-border flex flex-row m-auto justify-between w-full rounded-none z-50 h-10 shadow-none border-0">
                <div className="flex flex-row justify-begin grow basis-0 items-center gap-4 h-full">
                    {!isMobile && (
                        <Link href="/" prefetch={false} className="pl-5 shrink-0 p-0 h-full flex items-center justify-center">
                            <ClipFusionLogo width="16" height="16" />
                        </Link>
                    )}
                    <MenubarMenu>
                        <MenubarTrigger className="group" asChild>
                            <Button variant="ghost" className="p-0 [&>svg]:group-data-[state='open']:rotate-[-180deg] gap-1 hover:bg-none">
                                {isMobile ? (
                                    <ClipFusionLogo className="px-1" width="16" height="16" />
                                ) : "Menu"} <ChevronDownIcon className="text-muted-foreground duration-75 transition-[rotate]" size={15} />
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
                            <MenubarSeparator />
                            <MenubarItem onClick={() => router.push('/')}>Back to Project Library</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </div>
                <div className="flex flex-row justify-center grow basis-0">
                    <ProjectRenamePopover className="w-56 sm:w-70 md:w-96" />
                </div>
                <div className="flex flex-row justify-end grow basis-0">
                    <ThemeSwitcher className="pr-5" variant="transparent" />
                </div>
            </Menubar>
        </>
    ) : (
        <div className="flex items-center justify-center w-screen h-screen">
            <ClipFusionLogo width="100" height="100" />
        </div>
    );
}