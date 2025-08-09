import { renderFrame } from "@/lib/rendering/rendering";
import { useEditorStore } from "@/store/useEditorStore";
import { useEffect } from "react";

const useRendering = () => {
    const { project, canvasData, playbackData } = useEditorStore();

    useEffect(() => {
        if (!canvasData || !canvasData.canvas || !canvasData.ctx || !project || !playbackData) {
            console.log("couldn't render a frame because of bad editor state");
            return;
        }

        renderFrame(project, canvasData, playbackData);
    }, [project, canvasData, playbackData]);

};

export default useRendering;