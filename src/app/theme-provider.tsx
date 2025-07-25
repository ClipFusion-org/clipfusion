"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ComponentProps, ReactNode, useEffect } from "react";

const useMetaTheme = () => {
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
};

const ThemeProvider = (props: ComponentProps<typeof NextThemeProvider>): ReactNode => {
    useMetaTheme();
    return (
       <NextThemeProvider {...props} attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {props.children}
        </NextThemeProvider>
    )
};

export default ThemeProvider;