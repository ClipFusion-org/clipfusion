"use client";
import { ThemeProvider as NextThemeProvider, useTheme } from "next-themes";
import { ComponentProps, ReactNode, useEffect } from "react";

const MetaThemeProvider = ({
    children
}: {
    children: ReactNode
}) => {
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        let themeColorMeta = document.querySelector(
            'meta[name="theme-color"]',
        ) as HTMLMetaElement;

        if (!themeColorMeta) {
            themeColorMeta = document.createElement('meta');
            themeColorMeta.name = 'theme-color';
            document.head.appendChild(themeColorMeta);
        }

        themeColorMeta.content = resolvedTheme === 'dark' ? '#171717' : '#fff';
    }, [resolvedTheme]);

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