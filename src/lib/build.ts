const getBuildID = () => (
    process.env.NODE_ENV == "development" ? "development build" : process.env.BUILD_ID
);

export default getBuildID;