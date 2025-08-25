import { getValue, Updater, ValueAndSetter, ValueOrUpdater } from "@/lib/storeUtils";
import { create } from "zustand";

interface TimelineStore {
    pixelsPerFrame: number,
    setPixelsPerFrame: Updater<number>,

    selectedSegments: (string | undefined)[],
    setSelectedSegments: Updater<(string | undefined)[]>
}

export const useTimelineStore = create<TimelineStore>()((set) => ({
    pixelsPerFrame: 3,
    setPixelsPerFrame: (pfs: ValueOrUpdater<number>) => set((state) => ({ pixelsPerFrame: getValue(state.pixelsPerFrame, pfs) })),
    selectedSegments: [],
    setSelectedSegments: (segments: ValueOrUpdater<(string | undefined)[]>) => set((state) => ({ selectedSegments: getValue(state.selectedSegments, segments) }))
}));

export const usePixelsPerFrame = (): ValueAndSetter<number> => [
    useTimelineStore((state) => state.pixelsPerFrame),
    useTimelineStore((state) => state.setPixelsPerFrame)
];

export const useSelectedSegments = (): ValueAndSetter<(string | undefined)[]> => [
    useTimelineStore((state) => state.selectedSegments),
    useTimelineStore((state) => state.setSelectedSegments)
];