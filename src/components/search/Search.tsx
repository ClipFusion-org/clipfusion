import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ComponentProps, ReactNode } from "react";

export const Search = (props: ComponentProps<typeof Input>): ReactNode => (
    <div className="relative">
        <Input
            type="text"
            placeholder="Search"
            className="peer block w-full rounded-md border py-[9px] pl-10 text-sm"
            {...props}
        />
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2" />
    </div>
);