import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "@/components/dashboard";
import "./globals.css";
import ThemeProvider from "./theme-provider";
import Analytics from "./analytics";
import PersistenceProvider from "./persistence-provider";
import { Toaster } from "@/components/ui/sonner";
import PWAHead from "./pwa-head";

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

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
    themeColor: [
        { color: 'var(--background)', media: '(prefers-color-scheme: light)' },
        { color: 'var(--background)', media: '(prefers-color-scheme: dark)' },
    ],
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <PWAHead/>
                <Analytics/>
            </head>
            <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
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
