import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export const StickyTopContainer = (props: ComponentProps<"div">) => (
    <div {...props} className={cn("flex flex-col sticky top-safe bg-background gap-2 pb-2 pt-4 px-5 w-[100% + 5 * var(--spacing)] z-10 -mx-5", props.className)}/>
)