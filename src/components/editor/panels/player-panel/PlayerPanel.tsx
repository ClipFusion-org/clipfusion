import { useEditorStore } from "@/store/useEditorStore";
import { Panel, PanelContent, PanelHeader } from "../panel";
import { ComponentProps, useCallback, useRef } from "react";
import PlaybackControls from "../../controls/playback-controls";
import ProjectControls from "../../controls/project-controls";

export const PlayerPanel = (props: ComponentProps<typeof Panel>) => {
    const { canvas, setCanvas, project } = useEditorStore();
    const canvasContainerRef = useRef<HTMLDivElement>(null);

    const onResize = useCallback(() => {
        if (!canvas || !canvasContainerRef.current) {
            console.log("canvas is undefined, something strange is going on");
            return;
        }
        const containerRect = canvasContainerRef.current.getBoundingClientRect();
        canvas.width = containerRect.width;
        canvas.height = containerRect.height;
    }, [canvas, canvasContainerRef]);

    return (
        <Panel {...props} onResize={onResize}>
            <PanelHeader>Player</PanelHeader>
            <PanelContent className="p-0 flex flex-col items-center justify-between h-full">
                <div className="flex flex-1 items-center justify-center w-full overflow-hidden p-4">
                    <div ref={canvasContainerRef} className="w-auto h-full aspect-square max-w-full max-h-full overflow-hidden" style={{backgroundColor: project?.backgroundColor ?? "#000000"}}>
                        <canvas ref={setCanvas} id="primary-canvas" />
                    </div>
                </div>
                <div className="flex shrink-0 flex-row justify-between items-center w-full h-10 px-2">
                    <div className="flex flex-row items-center justify-start grow basis-0">
                        <h3 className="text-muted-foreground text-sm">00:00:00/00:00:00</h3>
                    </div>
                    <div className="flex flex-row items-center justify-center grow basis-0">
                        <PlaybackControls />
                    </div>
                    <div className="flex flex-row items-center justify-end grow basis-0">
                        <ProjectControls />
                    </div>
                </div>
            </PanelContent>
        </Panel>
    )
};