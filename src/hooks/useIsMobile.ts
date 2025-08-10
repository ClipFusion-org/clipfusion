import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT) {
    const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

    React.useEffect(() => {
        const onResize = () => {
            setIsMobile(window.innerWidth < breakpoint)
        };
        window.addEventListener("resize", onResize)
        setIsMobile(window.innerWidth < breakpoint)
        return () => window.removeEventListener("resize", onResize)
    }, []);

    return !!isMobile
}
