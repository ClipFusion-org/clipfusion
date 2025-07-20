"use client";
import { FolderOpenIcon, HomeIcon, LucideIcon, PlusIcon, SettingsIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { ReactNode, useState, useCallback, useEffect } from "react";
import { SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarHeader, SidebarSeparator, SidebarFooter, Sidebar, SidebarGroupLabel, SidebarGroupAction } from "../ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import ClipFusionLogo from "../clipfusion-logo";
import { Input } from "../ui/input";
import Search from "../search";
import ThemeSwitcher from "../theme-switcher";

const WHITESPACE_REGEX = /\s+/g;

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
    const { theme, setTheme } = useTheme();
    const [darkModeChecked, setDarkModeChecked] = useState(false);

    const darkModeCallback = useCallback((checked: boolean) => {
        setTheme(checked ? "dark" : "light");
        setDarkModeChecked(checked);
    }, []);

    useEffect(() => {
        setDarkModeChecked(theme == "dark");
    }, []);

    return (
        <Sidebar>
            <SidebarHeader className="flex justify-center items-center">
                <ClipFusionLogo width="30" height="30">
                    <p className="font-bold text-xl select-none">ClipFusion</p>
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