import Project, { defaultProject } from "@/types/Project";
import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(...inputs));

export const generateUUID = () => (
    "randomUUID" in crypto
        ? crypto.randomUUID()
        : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
            (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
        )
);

export const isUUID = (input: string) => uuidRegex.test(input);

export const truncate = (str: string, maxLength: number) => (
    str.length > maxLength ? str.slice(0, maxLength - 3) + '...' : str
);

export const createProject = (): Project => {
    const date = Date.now();

    return {
        ...defaultProject,
        uuid: generateUUID(),
        creationDate: date,
        editDate: date
    } as Project;
};

export const clamp = (x: number, a: number, b: number): number => (
    Math.max(a, Math.min(x, b))
);