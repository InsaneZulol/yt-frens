import type { PlasmoCSConfig, PlasmoGetInlineAnchor, PlasmoGetStyle } from "plasmo";
import { BlackPill } from "~ui_components/blackpill";
import statusStyleText from "data-text:~ui_components/style/blackpill-style.css";
import friendlistStyleText from "data-text:~ui_components/style/friendlist-style.css";
import frienditemStyleText from "data-text:~ui_components/style/frienditem-style.css";

export const getStyle: PlasmoGetStyle = () => {
    const style = document.createElement("style");
    style.textContent = statusStyleText + friendlistStyleText + frienditemStyleText;
    return style;
};

export const config: PlasmoCSConfig = {
    matches: ["https://www.youtube.com/*", "http://www.youtube.com/*"],
    all_frames: true,
    run_at: "document_end"
};

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
    document.querySelector("#container #center");

export const RenderBlackpill = () => {
    return <BlackPill />;
};

export default RenderBlackpill;
