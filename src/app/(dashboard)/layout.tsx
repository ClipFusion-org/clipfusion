import { PropsWithChildren } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import Dashboard from "@/components/dashboard";

export default async function RootLayout({ children }: PropsWithChildren) {
    return (
        <SidebarProvider>
            <Dashboard />
            <main className="relative isolate h-full">
                {children}
            </main>
        </SidebarProvider>
    );
}
