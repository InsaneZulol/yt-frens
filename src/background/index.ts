import { MSG_EVENTS, type API_MSG_EVENTS, type TAB_UPDATE } from "~types/messages";

const trimTitle = (title: string): string => {
    if (title) {
        return title.substring(0, title.lastIndexOf(" - YouTube"));
    }
};

function trimUrl(url: string): string | null {
    const videoIdParam = "?v=";
    const index = url.indexOf(videoIdParam);
    if (index !== -1) {
        const videoId = url.slice(index + videoIdParam.length);
        const nextParamIndex = videoId.indexOf("&");
        return nextParamIndex === -1 ? videoId : videoId.slice(0, nextParamIndex);
    }
    return null;
}
//
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    const YouTube: boolean = tab.url && tab.url.includes("youtube.com");
    if (YouTube) {
        if (changeInfo.title && changeInfo.title.includes("YouTube")) {
            const resp = await chrome.tabs.sendMessage(tabId, {
                event: MSG_EVENTS.VID_DATA_REQUEST
            });
            console.log("resp:", resp);

            chrome.tabs.sendMessage(tabId, {
                event: MSG_EVENTS.TAB_UPDATE,
                params: {
                    url: tab.url,
                    title: trimTitle(tab.title),
                    video_pos: resp.video_pos,
                    video_duration: resp.video_duration,
                    video_muted: resp.video_muted,
                    is_playing: resp.is_playing
                } as TAB_UPDATE
            } as API_MSG_EVENTS);
        }
    }
});

// relay events back to the same content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event) {
        chrome.tabs.sendMessage(sender.tab.id, message);
    }
});

console.log("new bg script");
export {};
