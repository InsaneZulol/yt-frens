export enum MSG_EVENTS {
    TAB_UPDATE = "TAB_UPDATE",
    VID_DATA_REQUEST = "VID_DATA_REQUEST",
    VID_UPDATE = "VID_UPDATE"
}

export interface API_MSG_EVENTS {
    event: MSG_EVENTS;
    params?: TAB_UPDATE | VID_UPDATE;
}

export interface VID_UPDATE {
    is_playing: boolean;
    video_pos: number;
}

export interface VID_DATA_RESPONSE {
    video_pos: number;
    video_duration: number;
    video_muted: boolean;
    is_playing: boolean;
}

// tab update is full update, so it will request data from videopage, which
// we will add ontop of tab data
export interface TAB_UPDATE extends VID_DATA_RESPONSE {
    url: string;
    title: string;
}
