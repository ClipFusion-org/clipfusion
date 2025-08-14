import { ReactNode } from "react";
import Image from "next/image";

const ClipFusionLogo = (props: {
    children?: ReactNode,
    width?: number | `${number}`,
    height?: number | `${number}`,
    className?: string
}): ReactNode => (
    <div className={`flex flex-row items-center gap-2 hover:scale-105 duration-100 ${props.className}`}>
        <Image width={props.width} height={props.height} src="/clipfusion-community-logo.png" alt="ClipFusion Logo"/>
        {props.children}
    </div>
);

export default ClipFusionLogo;