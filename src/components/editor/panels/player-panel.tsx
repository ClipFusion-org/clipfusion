'use client';
import { useEditorStore } from "@/store/useEditorStore";
import { Panel, PanelContent, PanelHeader } from "./panel";
import { ComponentProps, useEffect, useRef } from "react";
import PlaybackControls from "../controls/playback-controls";
import ProjectControls from "../controls/project-controls";
import { defaultCanvasData } from "@/types/CanvasData";

const PlayerPanel = (props: ComponentProps<typeof Panel>) => {
    const { setCanvasData } = useEditorStore();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasDisplayRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.log("couldn't get webgl context because canvas is not available yet");
            return;
        }

        const ctx = canvas.getContext("webgl");
        if (!ctx) {
            console.log("failed to get webgl context");
            return;
        }
        const stream = canvas.captureStream(60);
        if (canvasDisplayRef.current) {
            canvasDisplayRef.current.srcObject = stream;
        }
        console.log("getting webgl context");
        setCanvasData({ canvas, ctx, stream });

        return () => {
            // stop all tracks
            stream.getTracks().forEach(t => t.stop());
            // detach from video
            if (canvasDisplayRef.current && canvasDisplayRef.current.srcObject === stream) {
                canvasDisplayRef.current.srcObject = null;
            }
            setCanvasData(defaultCanvasData);
        };
        // include setCanvasData for exhaustive-deps; refs are stable objects
    }, [canvasRef, canvasDisplayRef, setCanvasData]);

    return (
        <Panel {...props}>
            <PanelHeader>Player</PanelHeader>
            <PanelContent className="flex flex-col items-center justify-between h-full">
                <div className="flex flex-1 items-center justify-center w-full overflow-hidden">
                    <div className="w-full h-full overflow-hidden">
                        <canvas ref={canvasRef} id="primary-canvas" width="4230" height="2160" style={{ position: 'fixed', top: 0, left: 0, zIndex: -1000, display: 'none'}} />
                        <video className="w-full h-full object-contain" ref={canvasDisplayRef} autoPlay playsInline muted />
                    </div>
                </div>
                <div className="flex shrink-0 flex-row justify-between items-center w-full h-10">
                    <div className="flex flex-row items-center justify-start grow basis-0">
                        <h3 className="text-muted-foreground text-sm">00:00:00/00:00:00</h3>
                    </div>
                    <div className="flex flex-row items-center">
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

export default PlayerPanel;