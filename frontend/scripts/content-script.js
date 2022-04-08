function fun() {
    console.log('xxx');
    var _info = document.getElementById('info-contents').querySelector("#info");
    _info.insertAdjacentHTML('beforebegin', "<div id='debug_panel'>xxx</div>");
}

var CONTENTSCRIPT = (function () {
    // var _video = document.querySelector('video');
    // var _info = document.getElementById('info-contents').querySelector("#info");
    console.log('content script injeeeected');
    
    // https://developer.mozilla.org/pl/docs/Web/API/Element/insertAdjacentHTML
    // todo: change it to async await till this dom object exists or something
    setTimeout(fun, 1500);
})();