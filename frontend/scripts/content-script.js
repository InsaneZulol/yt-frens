function insertDebugPanel() {
    console.log('xx');
    let info_ = document.querySelector('#above-the-fold');
    // https://developer.mozilla.org/pl/docs/Web/API/Element/insertAdjacentHTML
    info_.insertAdjacentHTML('afterbegin', `
        <div class='debug_panel'>
            <p>DEBUG PANEL KURWA TEN<p><br>
            <p>Your room id is <p> <p class="dbg_room_id_nr"></p>
            <h2>Join</h2>
            <input type="text" id="roomId" name="room" minlength="1" maxlength="4" size="4">
            <button class="dbg-join_btn" type="button" onclick="join_room()">Join</button> <br>
            <h2>Create</h2>
            <button class="dbg-create_btn" type="button" onclick="create_room()">Create</button>
        </div>
        `);
}

var CONTENTSCRIPT = (function () {
    console.log('content script injected');
    setTimeout(insertDebugPanel, 800); // ładowanie skryptu na document_idle nie wystarcza
    // todo: change it to async await till this dom object exists or something
})();