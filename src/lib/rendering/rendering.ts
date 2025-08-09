import { CanvasData } from "@/types/CanvasData";
import { PlaybackData } from "@/types/PlaybackData";
import Project from "@/types/Project";
import { hex2rgba } from "../utils";

export const renderFrame = (project: Project, canvasData: CanvasData, _playbackData: PlaybackData) => {
    const gl = canvasData.ctx;
    if (!canvasData.canvas || !gl || !canvasData.stream) {
        console.log("webgl context is not available!");
        return;
    }
    gl.viewport(0, 0, canvasData.canvas.width, canvasData.canvas.height);
    console.log("rendering");
    const rgba = hex2rgba(project.backgroundColor ?? "#000000");
    if (rgba) {
        const [r, g, b, a] = rgba;
        gl.clearColor(r, g, b, a);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }
};