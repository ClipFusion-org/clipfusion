import { ReactNode } from "react";
import "@/app/globals.css";
import PersistenceProvider from "@/app/persistence-provider";

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <main className="relative w-screen h-screen isolate overflow-hidden py-safe">
            <PersistenceProvider>
                {children}
            </PersistenceProvider>
        </main>
    );
}