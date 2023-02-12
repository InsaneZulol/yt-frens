import { supabase } from "~/store"

const channel = supabase.channel('receipt', {
    config: {
        broadcast: { ack: true },
    },
});

async function send_message() {
    console.log("sending message");
    //send
    const resp = await channel.send({
        type: 'broadcast',
        event: 'supa',
        payload: { org: 'supabase' },
    })
    console.log(resp);
};

function ConnectionPage() {

    // listen
    channel
        .on('broadcast', { event: 'supa' }, (payload) => console.log(payload))
        .subscribe();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                padding: 16
            }}>
            <h2>test supabase</h2>
            <button onClick={send_message}>Create</button>
        </div>
    )
}
export default ConnectionPage