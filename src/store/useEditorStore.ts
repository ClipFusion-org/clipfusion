import { create } from "zustand";

type CanvasSize = [number, number];

interface EditorStore {
    canvas?: HTMLCanvasElement;
    setCanvas: (canvas: HTMLCanvasElement) => void
}

export const useEditorStore = create<EditorStore>()((set) => ({
    canvas: undefined,
    setCanvas: (canvas: HTMLCanvasElement) => set(() => ({canvas: canvas}))
}));