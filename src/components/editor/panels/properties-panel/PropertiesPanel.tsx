import { useEditorStore } from "@/store/useEditorStore";
import { Panel, PanelContent, PanelHeader } from "../panel";
import { Muted } from "@/components/typography";
import React from "react";
import { calculateRatioString, cn } from "@/lib/utils";

const PropertyName = (props: React.ComponentProps<typeof Muted>) => (
    <Muted {...props} className={cn("text-sm", props.className)} />
)

export const PropertiesPanel = () => {
    const { project } = useEditorStore();

    if (!project) {
        return (
            <Panel>
                <PanelContent>
                    <div className="w-full h-full flex justify-center items-center">
                        Nothing to Show
                    </div>
                </PanelContent>
            </Panel>
        )
    }

    return (
        <Panel>
            <PanelHeader>Properties</PanelHeader>
            <PanelContent>
                <div className="grid grid-cols-[1fr_2fr] w-full">
                    <PropertyName>Name:</PropertyName>
                    <p className="truncate">{project?.title}</p>

                    <PropertyName>Description:</PropertyName>
                    <p className="break-all">{project?.description}</p>

                    <PropertyName>Resolution:</PropertyName>
                    <p>{project?.height}p</p>

                    <PropertyName>Ratio:</PropertyName>
                    <p>{calculateRatioString(project?.ratio || 16 / 9)}</p>
                </div>
            </PanelContent>
        </Panel>
    );
};