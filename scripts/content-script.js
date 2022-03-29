var CONTENTSCRIPT = (function () {
    var _video = document.querySelector('video');
    var _info = document.getElementById('info');
    
    // nie dziala 
    // https://developer.mozilla.org/pl/docs/Web/API/Element/insertAdjacentHTML
    _info.insertAdjacentHTML('afterend', '<div id="debug_panel">two</div>');
});