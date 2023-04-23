// which person video controller component is attached to
import { Storage } from "@plasmohq/storage";

const storage = new Storage();

// reads attached_to value from localStorage, which resides in cs ctx
export const LS_GET_ATTACHED_TO = (): Promise<string> => {
    return storage.get("attached_to");
};

// sets attached_to value in localStoare, in cs ctx
export let LS_SET_ATTACHED_TO = async (uuid: string) => {
    storage.set("attached_to", uuid);
    console.log("set ATTACHED_TO to", await LS_GET_ATTACHED_TO());
};
