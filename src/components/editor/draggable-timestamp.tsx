import useDrag from "@/hooks/useDrag";
import { usePlaybackData, useProject } from "@/stores/useEditorStore";
import { getProjectFPS, getTimeStringFromFrame } from "@/types/Project";
import React from "react";

const DraggableTimestamp = () => {
    const [project] = useProject();
    const [playbackData, setPlaybackData] = usePlaybackData();
    const { dragX, ref, dragging } = useDrag();

    React.useEffect(() => {
        setPlaybackData((prev) => ({
            ...prev,
            currentFrame: Math.max(0, prev.currentFrame + (dragX))
        }))
    }, [dragX]);

    return (
        <div className="select-none cursor-ew-resize opacity-80 hover:opacity-100 data-[dragging=true]:opacity-100 text-sm font-semibold" data-dragging={dragging} ref={ref as React.RefObject<HTMLDivElement>}>
            <p>{getTimeStringFromFrame(project, playbackData.currentFrame)}</p>
        </div>
    );
};

export default DraggableTimestamp;