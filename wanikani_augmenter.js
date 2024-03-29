// ==UserScript==
// @name         Wanikani Augmenter
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

    $("#answer-form > form > fieldset")
        .prepend(
            $("<button>", { id: "deleteButton" })
                .css(
                    {
                        "position": "absolute",
                        "padding": "0 20px",
                        "top": "10px",
                        "left": "10px",
                        "height": "3em",
                        "background-color": "#fff",
                        "font-size": "1.5em",
                        "line-height": "1em",
                        "border": "none"
                    }
                ).append(
                    $("<i>", { class: "icon-remove" })
                )
        );

    $("#question-type")
        .before(
            $("<div>", { id: "errorDisplay" })
                .append(
                    $("<span>", { id: "meaningErrors" })
                ).append(
                    $("<span>", { id: "readingErrors" })
                )
        );

    var updateErrorDisplay = function () {
        var currentItem = $.jStorage.get("currentItem");

        var itemIndex;
        if (currentItem.rad) {
            itemIndex = "r" + currentItem.id;
        } else if (currentItem.kan) {
            itemIndex = "k" + currentItem.id;
        } else if (currentItem.voc) {
            itemIndex = "v" + currentItem.id;
        }

        var item = $.jStorage.get(itemIndex) || {};
        var wrongCount = $.jStorage.get("wrongCount");
        var questionCount = $.jStorage.get("questionCount");

        var meaningErrorsArea = $("#meaningErrors");
        meaningErrorsArea.empty();

        if (item && item.mi) {
            for (var i = item.mi; i > 0; i--) {
                meaningErrorsArea.append($("<i>", { class: "item-status icon-minus", "text": " meaning" }).attr({ "data-type": "meaning" }));
            }
        }
        if (item && item.mc) {
            meaningErrorsArea.append($("<i>", { class: "item-status icon-ok", "text": " meaning" }));
        }

        var readingErrorsArea = $("#readingErrors");
        readingErrorsArea.empty();
        if (item && item.ri) {
            for (var j = item.ri; j > 0; j--) {
                readingErrorsArea.append($("<i>", { class: "item-status icon-minus", "text": " reading" }).attr({ "data-type": "reading" }));
            }
        }
        if (item && item.rc) {
            readingErrorsArea.append($("<i>", { class: "item-status icon-ok", "text": " reading" }));
        }

        $.jStorage.stopListening("questionCount");

        $.jStorage.set("questionCount", questionCount);
        $.jStorage.set("wrongCount", wrongCount);

        $.jStorage.listenKeyChange("questionCount", function () {
            updateErrorDisplay();
        })

        $(".item-status").css({ "padding": "0px 5px" });
        $(".item-status.icon-minus").css({ "color": "red" }).css({ "cursor": "pointer" }).on("click", function () { removeAnswer($(this).data()); });
        $(".item-status.icon-ok").css({ "color": "green" });
        $(".errorTitle").css({ "padding": "0 10px" });
    }

    var removeAnswer = function (answerDetails) {
        var currentItem = $.jStorage.get("currentItem");
        var questionType = answerDetails.type || $.jStorage.get("questionType");
        var questionCount = $.jStorage.get("questionCount");
        var wrongCount = $.jStorage.get("wrongCount");

        var itemIndex;
        if (currentItem.type === "Radical") {
            itemIndex = "r" + currentItem.id;
        } else if (currentItem.type === "Kanji") {
            itemIndex = "k" + currentItem.id;
        } else if (currentItem.type === "Vocabulary") {
            itemIndex = "v" + currentItem.id;
        }

        var item = $.jStorage.get(itemIndex);

        if (questionType === 'meaning') {
            if (item && item.mi > 0) {
                item.mi -= 1;
                questionCount -= 1;
                wrongCount -= 1;

                $("#user-response").effect("shake", {}, 100, function () {
                    $("#answer-form > form > fieldset").removeClass("incorrect");
                });
            }
        } else if (questionType === 'reading') {
            if (item && item.ri > 0) {
                item.ri -= 1;
                questionCount -= 1;
                wrongCount -= 1;

                $("#user-response").effect("shake", {}, 100, function () {
                    $("#answer-form > form > fieldset").removeClass("incorrect");
                });
            }
        }

        $.jStorage.set(itemIndex, item);
        $.jStorage.set("questionCount", questionCount);
        $.jStorage.set("wrongCount", wrongCount);

        updateErrorDisplay();
    }

    $(document).on("keydown.inReviews", function (event) {
        if (
            !$("#user-response").is(":focus") &&
            !$("#note-reading form textarea").is(":focus") &&
            !$("#note-meaning form textarea").is(":focus") &&
            !$(".user-synonyms-add-form input").is(":focus") &&
            event.keyCode == 8) {
            removeAnswer({});
            event.preventDefault();
            event.stopPropagation();
        }
    });

    $("#deleteButton").on("click", function () {
        removeAnswer({});
        event.preventDefault();
        event.stopPropagation();
    });

    $.jStorage.listenKeyChange("currentItem", function () {
        updateErrorDisplay();
    });

    $.jStorage.listenKeyChange("questionCount", function () {
        updateErrorDisplay();
    })
})(unsafeWindow.$);
