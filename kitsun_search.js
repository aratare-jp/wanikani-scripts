// ==UserScript==
// @name         Kitsun Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @grant        GM_openInTab
// @run-at       context-menu

// ==/UserScript==

(function (window) {
    'use strict';

    function selection() {
        if (window.getSelection) {
            return window.getSelection().toString();
        } else {
            return null;
        }
    }

    var selected = selection();

    GM_openInTab("https://kitsun.io/dictionary/" + encodeURIComponent(selected), {active: true});
})(window);
