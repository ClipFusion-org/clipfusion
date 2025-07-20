"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

const Providers = ({
    children
}: {
    children: ReactNode
}): ReactNode => {
    return (
       <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
    )
};

export default Providers;