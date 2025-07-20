import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "@/components/dashboard";
import "./globals.css";
import Providers from "./providers";

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


export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head/>
            <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
                <Providers>
                    <SidebarProvider>
                        <Dashboard/>
                        <main>
                            {children}
                        </main>
                    </SidebarProvider>
                </Providers>
            </body>
        </html>
    );
}
