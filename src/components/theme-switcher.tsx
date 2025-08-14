"use client";
import { useTheme } from "next-themes";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Toggle } from "./ui/toggle";
import { MoonIcon, SunIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const ThemeSwitcher = ({
    variant,
    className
}: {
    variant?: "with-text" | "transparent",
    className?: string
}): ReactNode => {
    const { resolvedTheme, setTheme } = useTheme();
    const [dark, setDark] = useState(false);
    
    const onThemeChange = useCallback(() => {
        setTheme(resolvedTheme == "dark" ? "light" : "dark");
        setDark(resolvedTheme == "light");
    }, [resolvedTheme, dark]);

    useEffect(() => {
        setDark(resolvedTheme == "dark");
    }, []);

    if (variant === 'transparent') {
        return (
            <Button className={cn("bg-transparent dark:bg-transparent hover:bg-transparent hover:dark:bg-transparent cursor-pointer p-0 hover:text-muted-foreground", className)} variant="ghost" onClick={onThemeChange}>
                {dark ? <MoonIcon/> : <SunIcon/>}
            </Button>
        )
    }

    return (
        <Toggle className={className} pressed={dark} onPressedChange={onThemeChange}>
            {dark ? <MoonIcon/> : <SunIcon/>}
            {variant == "with-text" && (
                <Label>
                    {dark ? "Dark Theme" : "Light Theme"}
                </Label>
            )}
        </Toggle>
    );
};

export default ThemeSwitcher;