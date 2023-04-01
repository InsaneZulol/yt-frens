const trimTitle = (title: string): string => {
    if (title) {
        return title.substring(0, title.lastIndexOf(" - YouTube"));
    }
}

const trimUrl = (url: string): string => {
    if (url) {
        let start_index = url.indexOf("?v=") + 3; // add 3 to exclude the "?v=" part
        let end_index = url.indexOf("&list");
        return url.substring(start_index, end_index);
    }
}
// listen to updates of the tab from which the message was sent
// and relay the messages back to the tab
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action == "listen_to_tab_updates") {
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (tabId === sender.tab.id) {
                const updatedData = <chrome.tabs.TabChangeInfo>{};
                if (changeInfo.url) {
                    updatedData.url = trimUrl(changeInfo.url);
                }
                if (changeInfo.title) {
                    updatedData.title = trimTitle(changeInfo.title);
                }
                if (changeInfo.mutedInfo && changeInfo.mutedInfo.muted) {
                    updatedData.mutedInfo.muted = changeInfo.mutedInfo.muted;
                }
                if (Object.keys(updatedData).length > 0) {
                    console.log("tab update message:", updatedData);
                    sendResponse(updatedData);
                }
            }
        });
    }
    return true;
});

// listen for get_tab_info on startup and relay the tab data back
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action == "get_tab_info") {
        console.log("responding to get tab info sender url:", trimUrl(sender.tab.url), "tab.title: ", trimTitle(sender.tab.title));
        sendResponse({ 
            url: trimUrl(sender.tab.url),
            title: trimTitle(sender.tab.title),
            muted: sender.tab.mutedInfo.muted
        });
    }
    return true;
});


console.log('new bg script')
export { };