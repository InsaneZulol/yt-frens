import type { ActivityI } from "~activity";

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

const getDataFromDOM = (args) => {
    console.log("getDataFromDOM()");
    const interval = setInterval(() => {
        const player = document.querySelector("video");
        if (player) {
            // chrome.runtime.sendMessage({
            //     video_state: {
            //         video_duration: player.duration
            //     }
            // });
            player.ondurationchange = (event) => {
                console.log("Not sure why, but the duration of the video has changed.");
            };
            // Get duration
            // Start listening to important events like:
            // seeked
            // playing/paused
            // sidenote: if paused/play sent current timestamp on where paused/played
            player.onseeking = () => {
                console.debug("seeking");
            };
            player.onplay = () => {
                console.debug("playing");
                chrome.tabs.sendMessage(args.tabId, {
                    video_state: {
                        is_playing: true,
                        video_timestamp: player.currentTime
                    }
                });
            };
            player.onpause = () => {
                console.debug("paused");
                chrome.tabs.sendMessage(args.tabId, {
                    video_state: {
                        is_playing: false,
                        video_timestamp: player.currentTime
                    }
                });
            };
            player.onseeked = () => {
                console.debug("seeked");
                chrome.tabs.sendMessage(args.tabId, {
                    video_state: {
                        video_timestamp: player.currentTime
                    }
                });
            };
            console.log("PLAYER FOUND!!!!! ▶️▶️");
            clearInterval(interval);
            //   videoPlayerState = player.paused ? "paused" : "playing";
            //   const titleElement = document.querySelector("#container h1.title");
            //   if (titleElement) {
            // videoTitle = titleElement.textContent.trim();
            //   }
        }
    }, 250);
    return true;
};

const onNewVideo = async (tabId) => {
    let a = Promise.resolve(
        chrome.scripting.executeScript(
            {
                target: { tabId },
                world: "ISOLATED",
                func: getDataFromDOM,
                args: [tabId]
            },
            () => console.log("injection callback")
        )
    );
    console.log("execute res ", a);
    // UPDATE_ACTIVITY_STATE(new_activity);
};
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("AAAA message from DOM!", request);
});
// 1. on extension startup

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("youtube.com")) {
        if (changeInfo.url && changeInfo.url.includes("youtube.com/watch?v=")) {
            onNewVideo(tabId);
            console.log("new video!");
        }
        // update_tab_state
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

        // if (within youtube, video url changed)
        //      onNewVideo() {
        //           extractVideo
        //           attachListeners()
        //   }
    }
});

console.log("new bg script");
export {};
