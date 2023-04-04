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
        return nextParamIndex === -1
            ? videoId
            : videoId.slice(0, nextParamIndex);
    }
    return null;
}
chrome.runtime.onStartup.addListener(() => console.log("ON STARTUP EVENT 🚀"));
// listen to updates of the tab from which the message was sent
// and relay the messages back to the tab
// TODO: ten listener nie znika, trzeba wyjebać, może na starcie wszystkie
chrome.runtime.onMessage.addListener(async function (request, sender) {
    if (request.action == "listen_to_tab_updates") {
        chrome.tabs.onUpdated.addListener(
            (tabId, { url, title, mutedInfo }, tab) => {
                if (tabId === sender.tab.id) {
                    const updatedData = /*<chrome.tabs.TabChangeInfo>*/ <any>{};
                    if (url) updatedData.url = trimUrl(url);
                    if (title) updatedData.title = trimTitle(title);
                    if (mutedInfo && mutedInfo.muted !== undefined)
                        updatedData.tab_muted = mutedInfo.muted;

                    if (Object.keys(updatedData).length > 0) {
                        console.log(
                            "sending tab update message to cs",
                            updatedData
                        );
                        chrome.tabs.sendMessage(sender.tab.id, updatedData);
                        chrome.runtime.lastError &&
                            console.log("kurwa fail! ! ! ! ! 11");
                    }
                }
            }
        );
    }
});

// listen for get_tab_info on startup and relay the tab data back
chrome.runtime.onMessage.addListener(async function (
    request,
    sender,
    sendResponse
) {
    if (request.action == "get_tab_info") {
        sendResponse({
            url: trimUrl(sender.tab.url),
            title: trimTitle(sender.tab.title),
            muted: sender.tab.mutedInfo.muted
        });
    }
    return true;
});

console.log("new bg script");
export {};
