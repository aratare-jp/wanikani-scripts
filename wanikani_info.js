// ==UserScript==
// @name         Wanikani Info
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Rex Truong
// @match        http://www.wanikani.com/review/session
// @match        https://www.wanikani.com/review/session
// @grant        unsafeWindow
// ==/UserScript==

(function ($) {
    'use strict';

    $("#stats").prepend($("<span>", {id: "wanikaniAugmenterInformation"}));

    $("#wanikaniAugmenterInformation").append(
        $("<span>", { id: "srsInformation", text: "SRS " }).prepend($("<i>", { class: "icon-tasks" })).append($("<span>", { id: "srsLevel" }))
    );

    $("#wanikaniAugmenterInformation").append(
        $("<span>", { id: "radicalInformation", text: "R " }).prepend($("<i>", { class: "icon-inbox" })).append($("<span>", { id: "radicalCount" }))
    );

    $("#wanikaniAugmenterInformation").append(
        $("<span>", { id: "kanjiInformation", text: "K " }).prepend($("<i>", { class: "icon-inbox" })).append($("<span>", { id: "kanjiCount" }))
    );

    $("#wanikaniAugmenterInformation").append(
        $("<span>", { id: "vocabularyInformation", text: "V " }).prepend($("<i>", { class: "icon-inbox" })).append($("<span>", { id: "vocabularyCount" }))
    );

    var updateInformation = function() {
        var currentItem = $.jStorage.get("currentItem");
    
        $("#srsLevel").text(currentItem.srs);
    
        var radCount = 0, kanCount = 0, vocCount = 0;
    
        var completeSet = $.jStorage.get("activeQueue").concat($.jStorage.get("reviewQueue"));
    
        for (var i = 0; i < completeSet.length; i++) {
          radCount += (completeSet[i] && completeSet[i].rad === undefined) ? 0 : 1;
          kanCount += (completeSet[i] && completeSet[i].kan === undefined) ? 0 : 1;
          vocCount += (completeSet[i] && completeSet[i].voc === undefined) ? 0 : 1;
        }
    
        $("#radicalCount").text(radCount);
        $("#kanjiCount").text(kanCount);
        $("#vocabularyCount").text(vocCount);
      };

      $.jStorage.listenKeyChange("activeQueue", updateInformation);
      updateInformation();
})(unsafeWindow.$);