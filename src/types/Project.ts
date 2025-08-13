import { Entity } from "dexie";
import type EditorDB from "./EditorDB";

export default class Project extends Entity<EditorDB> {
    uuid!: string;
    origin!: string; // If the project was duplicated, origin will be equal to the UUID of original project
    title!: string;
    description!: string;
    creationDate!: number;
    editDate!: number;
    backgroundColor!: string;
    ratio!: string; // i.e '16:9', '19.5:9', '4:3'
    height!: number; // default is 1080p, width is derived from height using ratio
    previewRatio!: number; // default is 1, 2 means half of the resolution, 3, 4, 5 and so on
}

export const getProjectRatio = (project: Project): number => (
    typeof project.ratio === 'string' ? +project.ratio.split(":")[0] / +project.ratio.split(":")[1] : project.ratio
);

export const defaultProject: Project = {
    uuid: '',
    origin: '',
    title: 'New ClipFusion Project',
    description: '',
    creationDate: 0,
    editDate: 0,
    backgroundColor: '#000000',
    ratio: '16:9',
    height: 1080,
    previewRatio: 1,
} as Project;