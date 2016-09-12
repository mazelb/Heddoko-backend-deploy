$(function () {
    HistoryPopup.init();
});

var HistoryPopup = {
    popup: null,

    show: function (url) {
        Ajax.get("/admin/api/" + url).success(this.onShowHistory);
    },

    init: function () {
        var historyPopup = $('#notesHistoryPopup');

        this.popup = historyPopup.kendoWindow({
            title: i18n.Resources.Notes + " " + i18n.Resources.History,
            modal: true,
            pinned: true,
            visible: false,
            resizeable: false,
            draggable: true,
            actions: [
                "Close"
            ]
        }).data("kendoWindow");
    },

    onShowHistory: function (e) {
        var viewModel = new Array();

        var historyPopupModel = kendo.observable({
            notes: e.response
        });

        kendo.bind($("#notesHistoryPopup"), historyPopupModel);
        HistoryPopup.popup.open().center();
    }
};