import { clamp } from "@/lib/utils";
import { usePlaybackData, useProject } from "@/stores/useEditorStore";
import { getProjectLength } from "@/types/Project";
import React from "react";

const useLimitPlaybackData = () => {
    const [project] = useProject();
    const [playbackData, setPlaybackData] = usePlaybackData();

    React.useEffect(() => {
        setPlaybackData((prev) => ({
            ...prev,
            currentFrame: clamp(prev.currentFrame, 0, getProjectLength(project))
        }));
    }, [playbackData.currentFrame, project]);
};

export default useLimitPlaybackData;