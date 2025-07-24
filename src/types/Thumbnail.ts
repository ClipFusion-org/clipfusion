import { Entity } from "dexie";
import EditorDB from "./EditorDB";

export default class Thumbnail extends Entity<EditorDB> {
    uuid!: string;
    blob!: Blob;
    createdAt!: Date;
}