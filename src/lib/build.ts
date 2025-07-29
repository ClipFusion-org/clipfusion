export const getBuildID = () => (
    process.env.NODE_ENV == "development" ? "main" : process.env.NEXT_PUBLIC_GIT_COMMIT
);

export const getVersion = () => (
    process.env.NODE_ENV == "development" ? "development" : process.env.NEXT_PUBLIC_PACKAGE_VERSION
);