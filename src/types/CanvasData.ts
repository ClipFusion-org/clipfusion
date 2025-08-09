export interface CanvasData {
    canvas?: HTMLCanvasElement;
    ctx?: WebGLRenderingContext;
    stream?: MediaStream;
}

export const defaultCanvasData: CanvasData = {};