import Project from "@/types/Project";
import { create } from "zustand";

interface PlaybackData {
    playing: boolean;
}

interface EditorStore {
    project?: Project;
    setProject: (project: Project) => void;

    canvas?: HTMLCanvasElement;
    setCanvas: (canvas: HTMLCanvasElement) => void;

    playbackData: PlaybackData;
    setPlaybackData: (playbackData: Partial<PlaybackData>) => void;
}

export const useEditorStore = create<EditorStore>()((set) => ({
    setProject: (project: Project) => set((state) => ({project: {...state.project, ...project} as Project})),
    setCanvas: (canvas: HTMLCanvasElement) => set(() => ({canvas: canvas})),

    playbackData: {
        playing: false
    },
    setPlaybackData: (playbackData: Partial<PlaybackData>) => set((state) => ({playbackData: {...state.playbackData, ...playbackData}}))
}));