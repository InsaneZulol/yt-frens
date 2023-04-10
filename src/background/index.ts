import type { ActivityI } from "~activity";
import { MESSAGE_ACTIONS, type CHROME_API_MESSAGE, type TAB_UPDATE } from "~store";

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

// 1. on extension startup
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("youtube.com")) {
        if (changeInfo.title && changeInfo.title.includes("YouTube")) {
            console.log("new video!");
            chrome.tabs.sendMessage(tabId, {
                action: MESSAGE_ACTIONS.TAB_UPDATE,
                params: {
                    url: tab.url,
                    title: trimTitle(tab.title)
                } as TAB_UPDATE
            } as CHROME_API_MESSAGE);
        }
    }
    // update_tab_stat
    // const updated_data = /*<chrome.tabs.TabChangeInfo>*/ <any>{};
    // if (changeInfo.url) updated_data.url = trimUrl(changeInfo.url);
    // if (changeInfo.title) updated_data.title = trimTitle(changeInfo.title);
    // if (changeInfo.mutedInfo && changeInfo.mutedInfo.muted !== undefined)
    //     updated_data.tab_muted = changeInfo.mutedInfo.muted;

    // if (Object.keys(updated_data).length > 0) {
    //     console.log("sending tab update message to cs", updated_data);
    //     chrome.tabs.sendMessage(tabId, updated_data);
    //     chrome.runtime.lastError && console.log("kurwa fail!11");
    // }
    //
});

console.log("new bg script");
export {};
