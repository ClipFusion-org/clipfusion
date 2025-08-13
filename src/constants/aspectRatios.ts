interface AspectRatio {
    name: string;
    a: number;
    b: number;
}

const aspectRatios: AspectRatio[] = [
    { name: "Standard", a: 16, b: 9 },
    { name: "Mobile", a: 19.5, b: 9 },
    { name: "Square", a: 1, b: 1 },
    { name: "35mm Photo", a: 3, b: 2 },
    { name: "Large Format", a: 5, b: 4 },
    { name: "Widescreen", a: 16, b: 10 },
];

export default aspectRatios;