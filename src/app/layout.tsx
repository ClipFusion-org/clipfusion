import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "@/components/dashboard";
import "./globals.css";
import ThemeProvider from "./theme-provider";
import Analytics from "./analytics";
import PersistenceProvider from "./persistence-provider";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({
    variable: "--font-geist",
    subsets: ["latin"]
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "ClipFusion",
    description: "Desktop power right in your browser",
};


export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta name="apple-mobile-web-app-title" content="ClipFusion" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no"/>
                <meta name="apple-mobile-web-app-capable" content="yes"/>
                <meta name="HandheldFriendly" content="true" />
                <Analytics/>
            </head>
            <body style={{touchAction: "pan-x pan-y"}} className={`${geist.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider>
                    <SidebarProvider>
                        <Dashboard/>
                        <main className="w-full h-full">
                            <PersistenceProvider>
                                {children}
                            </PersistenceProvider>
                        </main>
                    </SidebarProvider>
                    <Toaster/>
                </ThemeProvider>
            </body>
        </html>
    );
}
