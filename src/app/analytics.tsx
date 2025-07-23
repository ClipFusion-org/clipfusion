import { ReactNode } from "react";

// Powered by Umami (https://umami.is/)
export default function Analytics(): ReactNode {
    if (process.env.NODE_ENV == "development") {
        console.log("Analytics is disabled in development environment");
        return (<></>);
    }
    return (
        <script defer src="https://analytics.clipfusion.org/script.js" data-website-id="c3ac4a05-f96b-44dc-840b-d6d8e651e37e"/>
    );
}