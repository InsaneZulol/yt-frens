export enum MSG_EVENTS {
    TAB_UPDATE = "TAB_UPDATE",
    VID_UPDATE = "VID_UPDATE",
    ATTACH = "ATTACH"
}

export interface TAB_UPDATE {
    url: string;
    title: string;
}

export interface VID_UPDATE {
    is_playing: boolean;
    video_pos: number;
}

export interface TARGET {
    user_id: string;
}

export interface API_MSG_EVENTS {
    event: MSG_EVENTS;
    params: TAB_UPDATE | VID_UPDATE | TARGET;
}
