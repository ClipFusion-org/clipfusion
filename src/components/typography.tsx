import { cn } from "@/lib/utils";
import React from "react";

export const Title = (props: React.ComponentProps<"h3">) => (
    <h3 {...props} className={cn("font-bold text-lg", props.className)} />
);

export const Muted = (props: React.ComponentProps<"p">) => (
    <p {...props} className={cn("text-muted-foreground", props.className)} />
);

export const Description = (props: React.ComponentProps<"p">) => (
    <Muted {...props} className={cn("text-xs", props.className)} />
);

export const NothingToShowPlaceholder = (props: React.ComponentProps<"p">) => (
    props.children ? <p {...props} /> : <Muted {...props}>Nothing to Show</Muted>
);

export const CollapsibleText = ({
    defaultOpen,
    className,
    ...props
}: React.ComponentProps<"div"> & {
    defaultOpen?: boolean
}) => {
    const [open, setOpen] = React.useState(defaultOpen);

    return (
        <div {...props} onClick={() => setOpen(!open)} className={cn(className, open ? `break-all` : `truncate`, "cursor-pointer hover:opacity-80")} />
    )
};

export const SwitchableText = ({
    a, b, defaultValue = false
}: {
    a: React.ReactNode,
    b: React.ReactNode, 
    defaultValue?: boolean
}) => {
    const [showB, setShowB] = React.useState(defaultValue);

    return (
        <div onClick={() => setShowB(!showB)}>
            {showB ? b : a}
        </div>
    );
};