import { cn } from "@/lib/utils";
import { ComponentProps } from "react";

export const Panel = (props: ComponentProps<"div">) => (
    <div {...props} className={cn("w-full h-full rounded-xl bg-panel border-border border-4 overflow-hidden", props.className)}/>
);

export const PanelHeader = (props: ComponentProps<"div">) => (
    <div {...props} className={cn("flex flex-row items-center justify-begin w-full h-8 p-2 bg-header border-b-[1px] border-b-white dark:border-b-black", props.className)}/>
);

export const PanelContent = (props: ComponentProps<"div">) => (
    <div {...props} className={cn("w-full h-full p-4", props.className, "pb-8")}/>
);