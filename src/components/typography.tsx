import { cn } from "@/lib/utils";
import React from "react";

export const Title = (props: React.ComponentProps<"h3">) => (
    <h3 {...props} className={cn("font-bold text-lg", props.className)} />
);

export const Muted = (props: React.ComponentProps<"p">) => (
    <p {...props} className={cn("text-muted-foreground", props.className)} />
);

export const Description = (props: React.ComponentProps<"p">) => (
    <p {...props} className={cn("text-xs text-muted-foreground", props.className)} />
);