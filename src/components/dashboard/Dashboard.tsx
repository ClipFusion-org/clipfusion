"use client";
import { FolderOpenIcon, LucideIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { ReactNode } from "react";
import { SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarHeader, SidebarFooter, Sidebar, SidebarGroupLabel, SidebarGroupAction } from "../ui/sidebar";
import Link from "next/link";
import { Label } from "../ui/label";
import ClipFusionLogo from "../clipfusion-logo";
import ThemeSwitcher from "../theme-switcher";

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
        <Sidebar>
            <SidebarHeader className="flex justify-center items-center">
                <ClipFusionLogo width="30" height="30">
                    <p className="font-bold text-xl select-none">Community</p>
                </ClipFusionLogo>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Quick Access
                    </SidebarGroupLabel>
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
                        <Label className="flex justify-center text-sm text-muted-foreground">Nothing to show</Label>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <ThemeSwitcher variant="with-text"/>
            </SidebarFooter>
        </Sidebar>
    );
};