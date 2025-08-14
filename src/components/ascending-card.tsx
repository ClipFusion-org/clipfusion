import { ComponentProps } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";

const AscendingCard = (props: ComponentProps<typeof Card>) => (
    <Card {...props} className={cn("shadow-md hover:scale-[101%] hover:drop-shadow-xl duration-100", props.className)}/>
);

export default AscendingCard;