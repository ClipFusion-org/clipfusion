import { generateUUID } from "@/lib/utils";

export default interface Segment {
    uuid: string;
    start: number;
    length: number;
}

const defaultSegment: Segment = {
    uuid: '',
    start: 0,
    length: 30
};

export const generateSegment = (): Segment => ({
    ...defaultSegment,
    uuid: generateUUID()
});