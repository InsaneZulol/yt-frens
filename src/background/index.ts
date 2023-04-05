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
chrome.tabs.onUpdated.addListener((tabId, { url, title, mutedInfo }, tab) => {
    if (tab.url && tab.url.includes("youtube.com")) {
        const updatedData = /*<chrome.tabs.TabChangeInfo>*/ <any>{};
        if (url) updatedData.url = trimUrl(url);
        if (title) updatedData.title = trimTitle(title);
        if (mutedInfo && mutedInfo.muted !== undefined)
            updatedData.tab_muted = mutedInfo.muted;

        if (Object.keys(updatedData).length > 0) {
            console.log("sending tab update message to cs", updatedData);
            chrome.tabs.sendMessage(tabId, updatedData);
            chrome.runtime.lastError && console.log("kurwa fail!11");
        }
    }
});

console.log("new bg script");
export {};
