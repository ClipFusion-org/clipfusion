import { ReactNode } from "react";
import Image from "next/image";

export const ClipFusionLogo = (props: {
    children?: ReactNode,
    width?: number | `${number}`,
    height?: number | `${number}`,
    className?: string
}): ReactNode => (
    <div className={`flex flex-row items-center gap-2 hover:scale-105 duration-100 ${props.className}`}>
        <Image width={props.width} height={props.height} src="/clipfusion-logo.svg" alt="ClipFusion Logo"/>
        {props.children}
    </div>
);