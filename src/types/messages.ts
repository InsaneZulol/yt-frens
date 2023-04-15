export enum MESSAGE_ACTIONS {
    TAB_UPDATE = "TAB_UPDATE",
    ATTACH = "ATTACH"
}

export interface TAB_UPDATE {
    url: string;
    title: string;
}

export interface TARGET {
    user_id: string;
}

export interface API_MESSAGING_EVENTS {
    action: MESSAGE_ACTIONS;
    params: TAB_UPDATE | TARGET;
}
