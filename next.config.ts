import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    generateBuildId: () => {
        if (process.env.NODE_ENV === "development") return "development server";
        if (!process.env.GIT_COMMIT) return "git commit hash is unavailable";
        const hash = process.env.GIT_COMMIT;
        if (!hash || hash.trim().length == 0) return "empty git commit hash";
        return hash;
    }
};

export default nextConfig;
