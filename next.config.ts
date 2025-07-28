import type { NextConfig } from "next";
import build from "next/dist/build";
import { describe } from "node:test";
const nextBuildId = require('next-build-id');

const buildId = nextBuildId({ dir: __dirname, describe: true })

const nextConfig: NextConfig = {
    output: "standalone",
    generateBuildId: () => buildId,
    env: {
        BUILD_ID: buildId
    }
    
};

export default nextConfig;
