import { generateUUID } from "@/lib/utils";
import Segment from "./Segment";

export default interface Track {
    uuid: string;
    name: string;
    segments: Segment[];
}

const defaultTrack: Track = {
    uuid: '',
    name: "New Track",
    segments: []
};

export const generateTrack = (): Track => ({
    ...defaultTrack,
    uuid: generateUUID(),
});