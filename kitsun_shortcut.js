// ==UserScript==
// @name         Kitsun Shortcut
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Rex Truong
// @match        https://kitsun.io/deck/*
// @grant        unsafeWindow

// ==/UserScript==

(function ($) {
    'use strict';

    $(document).on("keydown", function (event) {
        if (event.key === "Backspace") {
            $("body > div > div > div.overlay_container > div > section > div > div.bottom_bar > div.kitButton.ignore_btn.kitButton__warning > span").click();
        }
    });
})(unsafeWindow.$);
