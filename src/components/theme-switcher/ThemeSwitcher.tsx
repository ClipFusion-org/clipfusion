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
    const { theme, setTheme } = useTheme();
    const [dark, setDark] = useState(false);
    
    const onThemeChange = useCallback(() => {
        setTheme(theme == "dark" ? "light" : "dark");
        setDark(!dark);
    }, [theme, dark, setTheme]);

    useEffect(() => {
        setDark(theme == "dark");
    });

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