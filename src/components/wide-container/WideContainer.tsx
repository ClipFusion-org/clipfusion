import { ComponentProps } from "react";
import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";

export const WideContainer = (props: ComponentProps<"div">) => {
    const isMobile = useIsMobile();
    const cardWidth = "max-w-2xl w-full md:w-85 lg:w-130 xl:w-2xl";

    return (
        <div {...props} className={cn(`${isMobile ? "w-full" : cardWidth}`, props.className)}/>
    );
};