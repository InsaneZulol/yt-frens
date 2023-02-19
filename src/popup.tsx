import { useState } from "react"
import { supabase } from "~/store"

function IndexPopup() {
  const [data, setData] = useState("")

  async function sign_in_with_email(email_: string, password_: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email_,
      password: password_,
    });
  };


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16
      }}>
      <h2>
        Login
      </h2>
      <input onChange={(e) => setData(e.target.value)} value={data} />
      <a href="https://docs.plasmo.com" target="_blank">
        View Docs
      </a>
    </div>
  )
}

export default IndexPopup
