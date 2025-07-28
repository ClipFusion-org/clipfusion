export const getBuildID = () => (
    process.env.NODE_ENV == "development" ? "latest commit" : process.env.BUILD_ID
);

export const getVersion = () => (
    process.env.NODE_ENV == "development" ? "development" : process.env.VERSION
);