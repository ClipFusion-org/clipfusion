import type { NextConfig } from "next";
import { version } from "./package.json";

const nextConfig: NextConfig = {
    output: "standalone",
    generateBuildId: () => (process.env.GIT_COMMIT || null),
    env: {
        BUILD_ID: process.env.GIT_COMMIT,
        VERSION: version
    }
    
};

export default nextConfig;
