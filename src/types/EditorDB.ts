import Dexie, { type EntityTable } from "dexie";
import Project from "./Project";
import Duplication from "./Duplication";

export default class EditorDB extends Dexie {
    projects!: EntityTable<Project, 'uuid'>;
    duplications!: EntityTable<Duplication, 'uuid'>;

    constructor() {
        super('EditorDB');
        this.version(1).stores({
            projects: 'uuid, project',
            duplications: 'uuid, count'
        });
        this.projects.mapToClass(Project);
        this.duplications.mapToClass(Duplication);
    }
}
