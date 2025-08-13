import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { ResizablePanel } from "@/components/ui/resizable";

export const PanelContainer = (props: ComponentProps<"div">) => (
    <div {...props} className={cn("w-full h-full rounded-xl bg-panel border-panel-border border-4 overflow-hidden isolate", props.className)}/>
);

export const Panel = (props: ComponentProps<typeof ResizablePanel>) => (
    <ResizablePanel defaultSize={50} {...props}>
        <PanelContainer className={cn("w-full h-full rounded-xl bg-panel border-panel-border border-4 overflow-hidden isolate", props.className)}>
            {props.children}
        </PanelContainer>
    </ResizablePanel>
);

export const PanelHeader = (props: ComponentProps<"div">) => (
    <div {...props} className={cn("flex flex-row items-center justify-start w-full h-8 p-2 bg-header border-b border-white dark:border-black z-50", props.className)}/>
);

export const PanelFooter = (props: ComponentProps<typeof PanelHeader>) => (
    <PanelHeader {...props} className={cn("border-b-0 border-t", props.className)} />
)

export const PanelContent = (props: ComponentProps<"div">) => (
    <div {...props} className={cn("w-full h-full p-4 z-0", props.className, "pb-8")}/>
);