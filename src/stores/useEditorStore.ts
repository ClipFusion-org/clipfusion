import { Updater, ValueOrUpdater, getValue, ValueAndSetter } from "@/lib/storeUtils";
import { CanvasData, defaultCanvasData } from "@/types/CanvasData";
import { PlaybackData, defaultPlaybackData } from "@/types/PlaybackData";
import Project, { defaultProject } from "@/types/Project";
import { create } from "zustand";

interface EditorStore {
    project: Project;
    setProject: Updater<Project>;

    canvasData: CanvasData;
    setCanvasData: Updater<CanvasData>;

    playbackData: PlaybackData;
    setPlaybackData: Updater<PlaybackData>;
}

export const useEditorStore = create<EditorStore>()((set) => ({
    project: defaultProject,
    setProject: (project: ValueOrUpdater<Project>) => set((state) => ({ project: ({ ...getValue(state.project, project) } as Project) })),
    
    canvasData: defaultCanvasData,
    setCanvasData: (canvasData: ValueOrUpdater<CanvasData>) => set((state) => ({ canvasData: ({ ...getValue(state.canvasData, canvasData) } as CanvasData) })),

    playbackData: defaultPlaybackData,
    setPlaybackData: (playbackData: ValueOrUpdater<PlaybackData>) => set((state) => ({ playbackData: ({ ...getValue(state.playbackData, playbackData) } as PlaybackData) }))
}));

export const useProject = (): ValueAndSetter<Project> => [
    useEditorStore((state) => state.project),
    useEditorStore((state) => state.setProject),
];

export const useCanvasData = (): ValueAndSetter<CanvasData> => [
    useEditorStore((state) => state.canvasData),
    useEditorStore((state) => state.setCanvasData),
];

export const usePlaybackData = (): ValueAndSetter<PlaybackData> => [
    useEditorStore((state) => state.playbackData),
    useEditorStore((state) => state.setPlaybackData),
];