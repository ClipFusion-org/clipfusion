"use client";
import { useTheme } from "next-themes";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { Toggle } from "../ui/toggle";
import { MoonIcon, SunIcon } from "lucide-react";
import { Label } from "@radix-ui/react-label";

export const ThemeSwitcher = ({
    variant
}: {
    variant?: "with-text"
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

    return (
        <Toggle pressed={dark} onPressedChange={onThemeChange}>
            {dark ? <MoonIcon/> : <SunIcon/>}
            {variant == "with-text" && (
                <Label>
                    {dark ? "Dark Theme" : "Light Theme"}
                </Label>
            )}
        </Toggle>
    );
};