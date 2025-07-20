import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "@/components/dashboard";
import "./globals.css";
import ThemeProvider from "./theme-provider";

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
                <ThemeProvider>
                    <SidebarProvider>
                        <Dashboard/>
                        <main>
                            {children}
                        </main>
                    </SidebarProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
