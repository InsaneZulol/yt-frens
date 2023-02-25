// - Pobrać liste friendsów z bazy danych i wyświetlić na homepage/, videopage/,
// - Zacząć trackować presence friendsów(i widzieć na jakim są channelu)
// - Zacząć od spróbowania integracji reacta w tym CS.
import test from "node:test";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo"
import type { PlasmoGetOverlayAnchor } from "plasmo"
import { supabase } from "~/store"

export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/", "http://www.youtube.com/"],
  all_frames: true,
  run_at: "document_idle",
  css: ["./yt-style.css"],
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () =>
  document.querySelector("#header");

const CustomButton = () => {
  return <div
    style={{
      background: "red",
      padding: 12,
      color: "white",
      fontSize: 20,
      borderRadius: "20px",
      height: 250,
      width: 220,
      marginLeft: 10,
      marginTop: 10,
      // position: "relative",
      // left: "400px"
    }}
    className="huj">
      Friends
  </div>
}
export default CustomButton

// React CS UI
// https://docs.plasmo.com/framework/content-scripts-ui

// export const render = async ({ createRootContainer }) => {
//   const rootContainer = await createRootContainer()
//   const root = createRoot(rootContainer)
//   root.render(<PlasmoOverlay />)
// }