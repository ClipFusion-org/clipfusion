import useDrag from "@/hooks/useDrag";
import { cn } from "@/lib/utils";
import { usePlaybackData, useProject } from "@/stores/useEditorStore";
import { usePixelsPerFrame } from "@/stores/useTimelineStore";
import { getTimeStringFromFrame } from "@/types/Project";
import React from "react";

const DraggableTimestamp = (props: React.ComponentProps<"p">) => {
    const [project] = useProject();
    const [playbackData, setPlaybackData] = usePlaybackData();
    const [pixelsPerFrame] = usePixelsPerFrame();
    const { dragX, ref, dragging } = useDrag();

    React.useEffect(() => {
        setPlaybackData((prev) => ({
            ...prev,
            currentFrame: Math.max(0, prev.currentFrame + (dragX / pixelsPerFrame))
        }))
    }, [dragX]);

    return (
        <div ref={ref as React.RefObject<HTMLDivElement>}>
            <p {...props} data-dragging={dragging} className={cn("select-none cursor-ew-resize opacity-80 hover:opacity-100 data-[dragging=true]:opacity-100 text-sm font-semibold", props.className)}>
                {getTimeStringFromFrame(project, playbackData.currentFrame)}
            </p>
        </div>
    );
};

export default DraggableTimestamp;