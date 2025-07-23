import { Entity } from "dexie";
import type EditorDB from "./EditorDB";

export default class Project extends Entity<EditorDB> {
    uuid!: string;
    origin!: string; // If the project was duplicated, origin will be equal to the UUID of original project
    title!: string;
    description!: string;
    creationDate!: number;
    editDate!: number;
}