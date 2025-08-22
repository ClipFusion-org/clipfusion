import Segment from "./Segment";

export default interface Track {
    name: string;
    segments: Segment[];
}

export const defaultTrack: Track = {
    name: "New Track",
    segments: []
};