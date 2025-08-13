interface ResolutionVariant {
    name: string;
    height: number;
}

const resolutions: ResolutionVariant[] = [
    { name: "SD (Standard Definition)", height: 480 },
    { name: "HD (High Definition)", height: 720 },
    { name: "Full HD", height: 1080 },
    { name: "2K (quad HD)", height: 1440 },
    { name: "4K (Ultra HD)", height: 2160 },
    { name: "5K", height: 2880 },
    { name: "8K (Ultra HD)", height: 4320 }
];

export default resolutions;