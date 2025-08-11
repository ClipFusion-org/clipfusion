import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "@/components/dashboard";
import PersistenceProvider from "../persistence-provider";

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <SidebarProvider>
            <Dashboard />
            <main className="relative isolate h-full">
                <PersistenceProvider>
                    {children}
                </PersistenceProvider>
            </main>
        </SidebarProvider>
    );
}
