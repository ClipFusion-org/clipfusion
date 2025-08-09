'use client';
import { useEditorStore } from "@/store/useEditorStore";
import { Panel, PanelContent, PanelHeader } from "../panel";
import { ComponentProps, useEffect, useRef, useState } from "react";
import PlaybackControls from "../../controls/playback-controls";
import ProjectControls from "../../controls/project-controls";

export const PlayerPanel = (props: ComponentProps<typeof Panel>) => {
    const { project, canvasData, playbackData, setCanvasData: setCanvasData } = useEditorStore();
    const canvasContainerRef = useRef<HTMLDivElement>(null);
    const [canvasNode, setCanvasNode] = useState<HTMLCanvasElement | undefined>();
    const lastRenderedResolution = useRef<[number, number]>([0, 0]);

    const setCanvasRef = (node: HTMLCanvasElement) => {
        setCanvasNode(node);
    };
    
    const onResize = () => {
        if (!canvasData || !canvasData.canvas || !canvasContainerRef.current || !project || !playbackData) {
            console.log("canvas is undefined, something strange is going on");
            return;
        }
        const containerRect = canvasContainerRef.current.getBoundingClientRect();
        if (containerRect.width == lastRenderedResolution.current[0] && containerRect.height == lastRenderedResolution.current[1]) return;
        canvasData.canvas.width = containerRect.width;
        canvasData.canvas.height = containerRect.height;
        lastRenderedResolution.current = [containerRect.width, containerRect.height];
        setCanvasData((prev) => ({
            ...prev,
            canvas: canvasData.canvas
        }));
    };

    useEffect(() => {
        if (!canvasNode) {
            console.log("couldn't get webgl context because canvas is not available yet");
            return;
        }
        const ctx = canvasNode.getContext("webgl");
        if (!ctx) {
            console.log("failed to get webgl context");
            return;
        }
        setCanvasData({
            canvas: canvasNode,
            ctx: ctx
        });
    }, [canvasNode]);

    return (
        <Panel {...props} onResize={onResize}>
            <PanelHeader>Player</PanelHeader>
            <PanelContent className="p-0 flex flex-col items-center justify-between h-full">
                <div className="flex flex-1 items-center justify-center w-full overflow-hidden p-4">
                    <div ref={canvasContainerRef} className="w-auto h-full aspect-square max-w-full max-h-full overflow-hidden bg-border">
                        <canvas ref={setCanvasRef} id="primary-canvas" width="128" height="128" />
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