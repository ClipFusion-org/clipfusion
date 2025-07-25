"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ComponentProps, ReactNode, useEffect } from "react";

const MetaThemeProvider = ({
    children
}: {
    children: ReactNode
}) => {
    useEffect(() => {
        const updateThemeColor = () => {
            const bgColor = window.getComputedStyle(document.body).backgroundColor;
            const metaThemeColor = document.querySelector("meta[name=theme-color]");
            metaThemeColor?.setAttribute("content", bgColor);
        };

        const observer = new MutationObserver(updateThemeColor);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"]
        });

        return () => observer.disconnect();
    }, []);

    return children;
}

const ThemeProvider = (props: ComponentProps<typeof NextThemeProvider>): ReactNode => {
    return (
       <NextThemeProvider {...props} attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <MetaThemeProvider>
                {props.children}
            </MetaThemeProvider>
        </NextThemeProvider>
    )
};

export default ThemeProvider;