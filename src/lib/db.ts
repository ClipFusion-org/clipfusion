import EditorDB from "@/types/EditorDB";
import Project from "@/types/Project";

export const db = new EditorDB();

export function addProject(project: Project) {
    db.projects.add(project);
    db.duplications.add({
        uuid: project.uuid,
        count: 0
    });
}

export async function deleteProject(uuid: string) {
    const project = await db.projects.where('uuid').equals(uuid).first();
    if (!project) return; // uuid is not valid, do nothing
    if (project.origin.length > 0) {
        // decreasing duplications count in the db
        const duplication = await db.duplications.where('uuid').equals(project.origin).first();
        if (duplication) {
            db.duplications.update(duplication.uuid, {
                ...duplication,
                count: Math.max(0, duplication.count - 1)
            });
        }
    }
    db.projects.delete(uuid);
    db.duplications.delete(uuid);
}

// StorageManager code from https://dexie.org/docs/StorageManager

/** Check if storage is persisted already.
  @returns {Promise<boolean>} Promise resolved with true if current origin is
  using persistent storage, false if not, and undefined if the API is not
  present.
*/
export async function isStoragePersisted() : Promise<boolean | undefined> {
    return await navigator.storage && navigator.storage.persisted ?
        navigator.storage.persisted() :
        undefined;
}

/** Tries to convert to persisted storage.
  @returns {Promise<boolean>} Promise resolved with true if successfully
  persisted the storage, false if not, and undefined if the API is not present.
*/
export async function persist(): Promise<boolean | undefined> {
    return await navigator.storage && navigator.storage.persist ?
        navigator.storage.persist() :
        undefined;
}

/** Queries available disk quota.
  @see https://developer.mozilla.org/en-US/docs/Web/API/StorageEstimate
  @returns {Promise<{quota: number, usage: number}>} Promise resolved with
  {quota: number, usage: number} or undefined.
*/
export async function showEstimatedQuota(): Promise<StorageEstimate | undefined> {
    return await navigator.storage && navigator.storage.estimate ?
        navigator.storage.estimate() :
        undefined;
}

/** Tries to persist storage without ever prompting user.
  @returns {Promise<string>}
    "never" In case persisting is not ever possible. Caller don't bother
      asking user for permission.
    "prompt" In case persisting would be possible if prompting user first.
    "persisted" In case this call successfully silently persisted the storage,
      or if it was already persisted.
*/
export async function tryPersistWithoutPromtingUser(): Promise<"never" | "prompt" | "persisted"> {
    if (!navigator.storage || !navigator.storage.persisted) {
        return "never";
    }
    let persisted = await navigator.storage.persisted();
    if (persisted) {
        return "persisted";
    }
    if (!navigator.permissions || !navigator.permissions.query) {
        return "prompt"; // It MAY be successful to prompt. Don't know.
    }
    const permission = await navigator.permissions.query({
        name: "persistent-storage"
    });
    if (permission.state === "granted") {
        persisted = await navigator.storage.persist();
        if (persisted) {
            return "persisted";
        } else {
            throw new Error("Failed to persist");
        }
    }
    if (permission.state === "prompt") {
        return "prompt";
    }
    return "never";
}