import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";
import ThemeProvider from "./theme-provider";
import Analytics from "./analytics";
import { Toaster } from "@/components/ui/sonner";
import PWAHead from "./pwa-head";
import { SwipeToDeleteContextProvider } from "@/components/swipe-to-delete";

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
                    <SwipeToDeleteContextProvider>
                        {children}
                    </SwipeToDeleteContextProvider>
                    <Toaster/>
                </ThemeProvider>
            </body>
        </html>
    );
}
