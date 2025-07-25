"use client";
import { FolderOpenIcon, LucideIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { ReactNode } from "react";
import { SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarHeader, SidebarFooter, Sidebar, SidebarGroupLabel, SidebarGroupAction } from "../ui/sidebar";
import Link from "next/link";
import { Label } from "../ui/label";
import ClipFusionLogo from "../clipfusion-logo";
import ThemeSwitcher from "../theme-switcher";
import Image from "next/image";
import { Tooltip, TooltipContent } from "../ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

interface DashboardItem {
    title: string;
    icon: LucideIcon;
    link: string;
}

const items: DashboardItem[] = [
    {
        title: "Project Library",
        icon: FolderOpenIcon,
        link: "/"
    },
    {
        title: "Settings",
        icon: SettingsIcon,
        link: "/settings"
    }
];


export const Dashboard = (): ReactNode => {
    return (
        <Sidebar className="ml-safe">
            <SidebarHeader className="flex justify-center items-center mt-safe-or-2">
                <Link href="/">
                    <ClipFusionLogo width="30" height="30">
                        <p className="font-bold text-xl select-none">ClipFusion</p>
                    </ClipFusionLogo>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Quick Access
                    </SidebarGroupLabel>
                    <SidebarGroupAction>
                        <PlusIcon/> <span className="sr-only">Add to Quick Access</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <Label className="flex justify-center text-sm text-muted-foreground">Nothing to Show</Label>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Platform
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                items.map((item) =>(
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <Link href={item.link}>
                                                <item.icon/> {item.title}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Folders
                    </SidebarGroupLabel>
                    <SidebarGroupAction>
                        <PlusIcon/> <span className="sr-only">Add Folder</span>
                    </SidebarGroupAction>
                    <SidebarGroupContent>
                        <Label className="flex justify-center text-sm text-muted-foreground">Nothing to Show</Label>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="mb-safe">
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Links
                    </SidebarGroupLabel>
                    <SidebarGroupContent className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center gap-3 pl-2">
                            <Tooltip>
                                <TooltipTrigger>
                                    <a href="https://github.com/ClipFusion-org/clipfusion" target="_blank">
                                        <Image src="/github-mark.svg" aria-hidden width="25" height="25" alt="ClipFusion GitHub Repository" className="duration-100 dark:invert hover:opacity-95 active:scale-95"/>
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>ClipFusion GitHub Repository</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger>
                                    <a href="https://git.clipfusion.org/ClipFusion-org/clipfusion" target="_blank">
                                        <Image src="/clipfusion-git-logo.png" aria-hidden width="25" height="25" alt="ClipFusion Git Mirror" className="duration-100 hover:opacity-95 active:scale-95"/>
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>ClipFusion Git Mirror</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <ThemeSwitcher/>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
};