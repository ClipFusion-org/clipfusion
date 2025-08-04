import { useEffect, useState } from "react";

// making this a separate hook helps declutter the main codebase a little

const useUserAgent = (): string | undefined => {
    const [userAgent, setUserAgent] = useState<string>();

    useEffect(() => {
        setUserAgent(navigator.userAgent);
    }, []);

    return userAgent;
};

export default useUserAgent;