$(function () {
    Notifications.init();
});

var Notifications = {
    notification: null,
    staticNotification: null,
    types: {
        success: 'success',
        info: 'info',
        warning: 'warning',
        error: 'error'
    },
    body: null,
    parseType: function (type) {
        switch (type) {
            case 0:
                return this.types.success;
            case 1:
                return this.types.info;
            case 2:
                return this.types.warning;
            case 3:
                return this.types.error;
        }
        return type;
    },
    init: function () {
        this.staticNotification = $("#staticNotification").kendoNotification({
            appendTo: ".notifications"
        }).data("kendoNotification");

        this.notification = $("#notification").kendoNotification({
            position: {
                pinned: true,
                top: 30,
                right: 30
            },
            autoHideAfter: 0,
            stacking: "down",
            templates: [{
                type: this.types.info,
                template: $("#notification-info").html()
            }, {
                type: this.types.warning,
                template: $("#notification-warning").html()
            }, {
                type: this.types.error,
                template: $("#notification-error").html()
            }, {
                type: this.types.success,
                template: $("#notification-success").html()
            }]
        }).data("kendoNotification");
    },
    info: function (Message) {
        this.add({
            Key: i18n.Resources.Information,
            Message: Message,
            Type: this.types.info
        });
    },
    error: function (Message) {
        this.add({
            Key: i18n.Resources.Error,
            Message: Message,
            Type: this.types.error
        });
    },
    warning: function (Message) {
        this.add({
            Key: i18n.Resources.Warning,
            Message: Message,
            Type: this.types.warning
        });
    },
    success: function (Message) {
        this.add({
            Key: null,
            Message: Message,
            Type: this.types.success
        });
    },
    add: function (notification, notificationsHolder) {
        if (notification) {
            var data = {
                Key: i18n.Resources.Error,
                Message: null,
                Type: this.types.error
            }
            switch (typeof (notification)) {
                case "object":
                    $.extend(data, notification);
                    break;
                case "string":
                    data.Message = notification;
                    break;
            }
            if (data.Message) {
                data.Key = data.Key || '';
                Notifications.notification.show(data, data.Type);
            }
        }
    },
    build: function (data) {
        var html = '<div class="alert';
        html += ' alert-' + this.parseType(data.Type);
        html += ' alert-dismissable">';
        html += '<button Type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
        if (data.Key) {
            html += '<strong>' + data.Key + ':</strong>&nbsp;';
        }
        html += data.Message.replace(/\n/g, '<br/>');
        html += '</div>';
        return html;
    },
    clear: function () {
        this.notification.hide();
        this.staticNotification.hide();
    }
};
