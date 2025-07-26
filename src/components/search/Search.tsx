"use client";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const Search = (props: ComponentProps<typeof Input>): ReactNode => (
    <div className={cn("relative", props.className)}>
        <Input
            {...props}
            type="text"
            className="peer block w-full rounded-md border py-[9px] pl-10"
        />
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
    </div>
);