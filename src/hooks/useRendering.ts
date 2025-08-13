import { renderFrame } from "@/lib/rendering/rendering";
import { useEditorStore } from "@/store/useEditorStore";
import { defaultPlaybackData } from "@/types/PlaybackData";
import { getProjectRatio } from "@/types/Project";
import React from "react";

const useRendering = () => {
    const { project, canvasData, playbackData } = useEditorStore();

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