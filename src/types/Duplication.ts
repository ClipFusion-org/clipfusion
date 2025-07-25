import { Entity } from "dexie";
import EditorDB from "./EditorDB";

export default class Duplication extends Entity<EditorDB> {
    uuid!: string;
    count!: number;
}