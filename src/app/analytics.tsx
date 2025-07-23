import { ReactNode } from "react";

// Powered by Umami (https://umami.is/)
export default function Analytics(): ReactNode {
    if (process.env.NODE_ENV == "development") {
        console.log("Analytics is disabled in development mode");
        return (<></>);
    }
    return (
        <script defer src={process.env.ANALYTICS_SCRIPT} data-website-id={process.env.ANALYTICS_WEBSITE_ID}/>
    )
}