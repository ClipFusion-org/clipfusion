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

        renderFrame(project, canvasData, playbackData ?? defaultPlaybackData);
    }, [project, canvasData, playbackData]);

};

export default useRendering;