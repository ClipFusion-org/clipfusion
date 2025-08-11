import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    generateBuildId: () => (process.env.NEXT_PUBLIC_GIT_COMMIT ? process.env.NEXT_PUBLIC_GIT_COMMIT : null),
    allowedDevOrigins: ['192.168.0.*']
};

export default nextConfig;
