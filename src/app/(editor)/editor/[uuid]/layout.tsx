import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "@/app/globals.css";
import ThemeProvider from "@/app/theme-provider";
import Analytics from "@/app/analytics";
import PersistenceProvider from "@/app/persistence-provider";
import { Toaster } from "@/components/ui/sonner";
import PWAHead from "@/app/pwa-head";

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
    userScalable: false,
    viewportFit: "cover"
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <main className="relative w-screen h-screen isolate overscroll-none">
            <PersistenceProvider>
                {children}
            </PersistenceProvider>
        </main>
    );
}