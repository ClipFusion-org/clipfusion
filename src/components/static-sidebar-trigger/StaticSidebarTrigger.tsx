"use client";
import { ReactNode } from "react";
import { SidebarTrigger } from "../ui/sidebar";

export const StaticSidebarTrigger = ({
    children
}: {
    children?: ReactNode
}) => {
    return (
        <>
            <div className="ml-10"/>
            <div className="absolute top-0 left-0 pl-6 pt-4 md:p-6 overscroll-auto">
                <SidebarTrigger className={`fixed mr-2 z-40 transition-colors`} size="lg" tabIndex={0}/>
                {children}
            </div>   
        </>     
    );
};