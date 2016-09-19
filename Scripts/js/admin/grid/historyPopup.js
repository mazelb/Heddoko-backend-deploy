$(function () {
    HistoryPopup.init();
});

var HistoryPopup = {
    popup: null,
    popupHistory: null, 
    show: function (url) {
        Ajax.get("/admin/api/" + url).success(this.onShowHistory.bind(this));
    },

    init: function () {
        this.popupHistory = $('#notesHistoryPopup');

        this.popup = this.popupHistory.kendoWindow({
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
        var historyPopupModel = kendo.observable({
            notes: e.response
        });

        kendo.bind(this.popupHistory, historyPopupModel);
        HistoryPopup.popup.open().center();
    }
};