import type { NextConfig } from "next";

const generateGitCommitHash = () => {
    if (process.env.NODE_ENV === "development") return "development server";
    if (!process.env.GIT_COMMIT) return "git commit hash is unavailable";
    const hash = process.env.GIT_COMMIT;
    if (!hash || hash.trim().length == 0) return "empty git commit hash";
    return hash;
}

const gitCommitHash = generateGitCommitHash();

const nextConfig: NextConfig = {
    output: "standalone",
    generateBuildId: () => gitCommitHash,
    webpack: (config, { webpack, buildId, isServer }) => {
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env.BUILD_ID_ENV': JSON.stringify(buildId)
            })
        );
        return config;
    }
};

export default nextConfig;
