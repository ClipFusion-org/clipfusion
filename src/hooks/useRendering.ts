import { renderFrame } from "@/lib/rendering/rendering";
import { useEditorStore } from "@/store/useEditorStore";
import { defaultPlaybackData } from "@/types/PlaybackData";
import { useEffect } from "react";

const useRendering = () => {
    const { project, canvasData, playbackData } = useEditorStore();

    useEffect(() => {
        if (!canvasData.canvas || !canvasData.ctx || !project) {
            console.log("couldn't render a frame because of bad editor state");
            return;
        }

        const canvas = canvasData.canvas;
        canvas.width = (project.height * project.ratio) / project.previewRatio;
        canvas.height = project.height / project.previewRatio;

        renderFrame(project, canvasData, playbackData ?? defaultPlaybackData);
    }, [project, canvasData, playbackData]);

};

export default useRendering;