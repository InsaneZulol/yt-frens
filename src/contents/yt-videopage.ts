import type { PlasmoCSConfig } from "plasmo"
import { supabase } from "~/store"

export const config: PlasmoCSConfig = {
    matches: ["https://www.youtube.com/watch?v=*", "http://www.youtube.com/watch?v=*"],
    all_frames: true,
    // css: ["~content.css"],
    run_at: "document_idle" // wydaje mi się, że nie musimy to robić w idle. Poprostu injectować dopiero jak obiekt się pojawi, on event.
}

console.log("Hello from content script");


async function getCountries() {
  const countries = await supabase.from('countries').select()
  console.log(countries)
};

try {
    console.log("get countries lol");   
    getCountries();
  } catch (err) {
    console.log(err);
  };