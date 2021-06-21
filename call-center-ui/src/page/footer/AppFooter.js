import {Footer} from "antd/lib/layout/layout";
import "./appFooter.css";

function AppFooter() {
    return (
        <Footer className={"app-footer"}><h3 className={"app-footer-title"}>&copy; 2021. All Rights
            Reserved.
            Site is Powered by <b>Call Center</b>.</h3></Footer>
    );
}

export default AppFooter;