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

export const hex2rgba = (hex: string, alpha: number = 255): [number, number, number, number] | null => {
    let c: string | null = null;
    // Remove '#' if present
    const cleanedHex = hex.startsWith('#') ? hex.slice(1) : hex;

    // Handle 3-digit hex (e.g., #F00)
    if (cleanedHex.length === 3) {
        c = cleanedHex.split('').map(char => char + char).join('');
    }
    // Handle 4-digit hex with alpha (e.g., #F00A)
    else if (cleanedHex.length === 4) {
        c = cleanedHex.slice(0, 3).split('').map(char => char + char).join('');
        alpha = parseInt(cleanedHex.slice(3, 4) + cleanedHex.slice(3, 4), 16) / 255;
    }
    // Handle 6-digit hex (e.g., #FF0000)
    else if (cleanedHex.length === 6) {
        c = cleanedHex;
    }
    // Handle 8-digit hex with alpha (e.g., #FF0000AA)
    else if (cleanedHex.length === 8) {
        c = cleanedHex.slice(0, 6);
        alpha = parseInt(cleanedHex.slice(6, 8), 16) / 255;
    } else {
        return null; // Invalid hex format
    }

    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);

    return [r / 255, g / 255, b / 255, alpha / 255];
}