import { ReactNode } from "react";
import "@/app/globals.css";
import PersistenceProvider from "@/app/persistence-provider";

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <main className="fixed w-full h-full isolate overflow-y-hidden overscroll-y-none">
            <div className="relative">
                <PersistenceProvider>
                    {children}
                </PersistenceProvider>
            </div>
        </main>
    );
}