'use client';
import { useEditorStore } from "@/store/useEditorStore";
import { Panel, PanelContent, PanelHeader } from "../panel";
import { ComponentProps, useEffect, useRef } from "react";
import PlaybackControls from "../../controls/playback-controls";
import ProjectControls from "../../controls/project-controls";
import { createPortal } from "react-dom";
import { defaultCanvasData } from "@/types/CanvasData";

export const PlayerPanel = (props: ComponentProps<typeof Panel>) => {
    const { setCanvasData } = useEditorStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasDisplayRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const canvasNode = canvasRef.current;
        if (!canvasNode) {
            console.log("couldn't get webgl context because canvas is not available yet");
            return;
        }
        const ctx = canvasNode.getContext("webgl");
        if (!ctx) {
            console.log("failed to get webgl context");
            return;
        }
        const stream = canvasNode.captureStream(60);
        if (canvasDisplayRef.current) {
            canvasDisplayRef.current.srcObject = stream;
        }
        setCanvasData({ canvas: canvasNode, ctx, stream });

        return () => {
            // stop all tracks
            stream.getTracks().forEach(t => t.stop());
            // detach from video
            if (canvasDisplayRef.current && canvasDisplayRef.current.srcObject === stream) {
                canvasDisplayRef.current.srcObject = null;
            }
            // release WebGL context if possible
            const lose = (ctx as WebGLRenderingContext).getExtension?.('WEBGL_lose_context');
            lose?.loseContext();
            // optionally reset store
            setCanvasData(defaultCanvasData);
        };
        // include setCanvasData for exhaustive-deps; refs are stable objects
    }, [canvasRef, canvasDisplayRef, setCanvasData]);

    return (
        <Panel {...props}>
            <PanelHeader>Player</PanelHeader>
            <PanelContent className="p-0 flex flex-col items-center justify-between h-full">
                <div className="flex flex-1 items-center justify-center w-full overflow-hidden p-4">
                    <div className="w-auto h-full aspect-square max-w-full max-h-full overflow-hidden bg-border">
                        {createPortal(<canvas ref={canvasRef} id="primary-canvas" width="4320" height="2160" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1000 }} />, document.body)}
                        <video className="w-full h-full" ref={canvasDisplayRef} autoPlay playsInline muted />
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