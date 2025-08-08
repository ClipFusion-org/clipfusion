import Project from "@/types/Project";
import { create } from "zustand";

interface PlaybackData {
    playing: boolean;
}

interface EditorStore {
    project?: Project;
    setProject: (project: Partial<Project>) => void;

    canvas?: HTMLCanvasElement;
    setCanvas: (canvas: HTMLCanvasElement) => void;

    playbackData: PlaybackData;
    setPlaybackData: (playbackData: Partial<PlaybackData> | ((prev: PlaybackData) => Partial<PlaybackData>)) => void;
}

export const useEditorStore = create<EditorStore>()((set) => ({
    setProject: (project: Partial<Project>) => set((state) => ({project: {...(state.project || {}), ...project} as Project})),
    setCanvas: (canvas: HTMLCanvasElement) => set({ canvas }),

    playbackData: {
        playing: false
    },
    setPlaybackData: (playbackDataOrUpdater: Partial<PlaybackData> | ((prev: PlaybackData) => Partial<PlaybackData>)) =>
        set((state) => {
            const playbackData =
                typeof playbackDataOrUpdater === 'function'
                    ? playbackDataOrUpdater(state.playbackData)
                    : playbackDataOrUpdater;
            return { playbackData: { ...state.playbackData, ...playbackData } };
        })
}));