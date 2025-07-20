import { Entity } from "dexie";
import type EditorDB from "./EditorDB";

class Project extends Entity<EditorDB> {
    uuid!: string;
    name!: string;
    creationDate!: number;
    editDate!: number;
}

export default Project;