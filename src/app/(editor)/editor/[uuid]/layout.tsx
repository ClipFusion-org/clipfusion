import { PropsWithChildren } from "react";
import "@/app/globals.css";

export default async function RootLayout({ children }: PropsWithChildren) {
    return (
        <main className="fixed h-full isolate overflow-hidden overscroll-none">
            {children}
        </main>
    );
}