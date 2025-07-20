"use client";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ComponentProps, ReactNode } from "react";

const ThemeProvider = (props: ComponentProps<typeof NextThemeProvider>): ReactNode => {
    return (
       <NextThemeProvider {...props} attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {props.children}
        </NextThemeProvider>
    )
};

export default ThemeProvider;