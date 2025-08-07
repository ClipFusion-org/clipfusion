import { useEditorStore } from "@/store/useEditorStore";
import { Panel, PanelContent, PanelTitle } from "../panel";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ComponentProps, useCallback, useRef } from "react";
import { ResizablePanel } from "@/components/ui/resizable";
import { PlayIcon } from "lucide-react";

export const PlayerPanel = (props: ComponentProps<typeof ResizablePanel>) => {
    const { canvas, setCanvas } = useEditorStore();
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
        <ResizablePanel {...props} onResize={onResize}>
            <Panel>
                <PanelTitle>Player</PanelTitle>
                <PanelContent className="p-0 flex flex-col items-center justify-between h-full">
                    <div className="flex flex-1 items-center justify-center w-full overflow-hidden">
                        <div ref={canvasContainerRef} className="w-auto h-full aspect-square max-w-full max-h-full bg-red-400 overflow-hidden">
                            <canvas ref={setCanvas} id="primary-canvas" />
                        </div>
                    </div>
                    <div className="flex shrink-0 flex-row justify-between items-center w-full h-10 px-2">
                        <div className="text-muted-foreground text-sm">
                            00:00:00/00:00:00
                        </div>
                        <div className="flex flex-row items-center justify-center">
                            <PlayIcon/>
                        </div>
                        <div/>
                    </div>
                </PanelContent>
            </Panel>
        </ResizablePanel>
    )
};