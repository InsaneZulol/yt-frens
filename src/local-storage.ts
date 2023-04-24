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
};
export const LS_GET_FRIENDLIST_IS_OPEN = async () => {
    storage.get("is_friendlist_open");
};
export let LS_SET_FRIENDLIST_IS_OPEN = async (val: boolean) => {
    storage.set("is_friendlist_open", val);
};
