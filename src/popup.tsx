import { useState } from "react"
import { supabase } from "~/store"

async function getCountries() {
  const countries = await supabase.from('countries').select()
  console.log(countries)
}

try {
  console.log("get countries lol");   
  getCountries();
} catch (err) {
  console.log(err);
}
function IndexPopup() {
  const [data, setData] = useState("")
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>
        Welcome to your{" "}
        <a href="https://www.plasmo.com" target="_blank">
          Plasmo
        </a>{" "}
        Extension!
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup
