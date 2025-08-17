import { renderFrame } from "@/lib/rendering/rendering";
import { useCanvasData, usePlaybackData, useProject } from "@/stores/useEditorStore";
import { defaultPlaybackData } from "@/types/PlaybackData";
import { getProjectRatio } from "@/types/Project";
import React from "react";

const useRendering = () => {
    const [project] = useProject();
    const [canvasData] = useCanvasData();
    const [playbackData] = usePlaybackData();

    React.useEffect(() => {
        if (!canvasData.canvas || !canvasData.ctx || !project) {
            console.log("couldn't render a frame because of bad editor state");
            return;
        }

        const canvas = canvasData.canvas;
        canvas.width = (project.height * getProjectRatio(project)) / project.previewRatio;
        canvas.height = project.height / project.previewRatio;

        renderFrame(project, canvasData, playbackData ?? defaultPlaybackData);
    }, [project, canvasData, playbackData]);

};

export default useRendering;