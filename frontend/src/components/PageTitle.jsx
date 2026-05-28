import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Map of route paths → page titles
const pageTitles = {
    "/": "Home | SkillPath",
    "/signin": "Sign In | SkillPath",
    "/signup": "Sign Up | SkillPath",
    "/progress": "My Progress | SkillPath",
    "/sheet/striver": "Striver Sheet | SkillPath",
    "/sheet/lovebabbar": "Love Babbar Sheet | SkillPath",
    "/sheet/daily": "Daily Challenge | SkillPath",
};

function PageTitle() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Use mapped title or fallback to a default
        const title = pageTitles[pathname] || "SkillPath";
        document.title = title;
    }, [pathname]); // runs every time the route changes

    return null; // renders nothing — only updates the title
}

export default PageTitle;
