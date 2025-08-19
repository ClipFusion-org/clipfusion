import { getValue, Updater, ValueAndSetter, ValueOrUpdater } from "@/lib/storeUtils";
import { create } from "zustand";

interface TimelineStore {
    pixelsPerFrame: number,
    setPixelsPerFrame: Updater<number>
}

export const useTimelineStore = create<TimelineStore>()((set) => ({
    pixelsPerFrame: 6,
    setPixelsPerFrame: (pfs: ValueOrUpdater<number>) => set((state) => ({ pixelsPerFrame: getValue(state.pixelsPerFrame, pfs) }))
}));

export const usePixelsPerFrame = (): ValueAndSetter<number> => [
    useTimelineStore((state) => state.pixelsPerFrame),
    useTimelineStore((state) => state.setPixelsPerFrame)
];