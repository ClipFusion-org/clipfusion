import Dexie, { type EntityTable } from "dexie";
import Project from "./Project";

export default class EditorDB extends Dexie {
    projects!: EntityTable<Project, 'uuid'>;

    constructor() {
        super('EditorDB');
        this.version(1).stores({
            projects: 'uuid, project'
        });
        this.projects.mapToClass(Project);
    }
}
