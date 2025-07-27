"use client";
import { useEffect, useState } from "react";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";

export const StaticSidebarTrigger = () => {
    const { open } = useSidebar();
    return (
        <>
            <div className="ml-10"/>
            <div className="absolute top-0 left-0 pl-6 pt-4 md:p-6 overscroll-auto">
                <SidebarTrigger className={`fixed mr-2 z-40 transition-colors will-change-[transform, scroll-position]`} size="lg" tabIndex={0}/>
            </div>   
        </>     
    );
};