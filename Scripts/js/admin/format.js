var Format = {
    image: function (url) {
        return url ? '<img class="img-grid" src="' + url + '" />' : '&nbsp;';
    },
    equipment: {
        equipmentQAStatus: function (item) {
            item = item != null ? Enums.EquipmentQAStatusType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        equipmentStatus: function (item) {
            item = item != null ? Enums.EquipmentStatusType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        status: function (item) {
            item = item != null ? Enums.EquipmentStatusType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        anatomicalPosition: function (item) {
            item = item != null ? Enums.AnatomicalPositionType.array[item].text : i18n.Resources.None;

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        anatomicalPositionImg: function (item) {
            var text = item != null ? Enums.AnatomicalPositionType.array[item].text : '';
            if (!item) {
                return '&nbsp;'
            }

            var div = '<div class="body-wrap">';
            div += '<img class="body" src="/Content/img/body.png" alt="' + text + '" title="' + text + '" height="150px" />';
            div += '<div class="body-circle capsule-' + item + '"></div>';
            div += ' </div>';

            return div;
        },
        notes: function (item) {
            var text = item ? item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\n/g, '<br/>') : '';
            var div = '<div class="grid-notes">'
            div += text;
            div += "</div>";
            return div;
        }
    },
    organization: {
        user: function (e) {
            var div = '<div class="">'
            div += i18n.Resources.Name + ': <b>' + e.user.name + '</b><br/>';
            div += i18n.Resources.Email + ': <b>' + e.user.email + '</b><br/>';
            div += i18n.Resources.Username + ': <b>' + e.user.username + '</b><br/>';
            div += "</div>";
            return div;
        }
    },
    notes: function (item) {
        var text = item ? item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\n/g, '<br/>') : '';
        var div = '<div class="grid-notes">'
        div += text;
        div += "</div>";
        return div;
    },
    license: {
        name: function (item) {
            item = item != null ? item : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        type: function (item) {
            item = item != null ? Enums.LicenseType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        status: function (item, date, skip) {

            var now = new Date();
            var diff = Math.round((date - now) / 1000 / 60 / 60 / 24);

            var warning = '';
            if (item == Enums.LicenseStatusType.enum.Active
             && diff > 0
             && diff < 10) {
                warning = this.iconStatus();
            }

            var icon = this.iconStatus(item);
            item = item != null ? Enums.LicenseStatusType.array[item].text : "";

            if (skip) {
                item = '';
            }

            return '<span class="k-grid-showText">' + icon + ' ' + item + ' ' + warning + '</span>';
        },
        used: function (item) {
            item = item == null ? 0 : item;

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        expiredAt: function (item) {
            item = kendo.toString(item, "yyyy-dd-MM");
            return '<span class="k-grid-showText">' + item + '</span>';
        },
        iconStatus: function (status) {
            switch (status) {
                case Enums.LicenseStatusType.enum.Active:
                    return '<i class="green status glyphicon glyphicon-ok-circle" title="' + i18n.Resources.LicenseStatusType_Active + '"></i>';
                case Enums.LicenseStatusType.enum.Deleted:
                    return '<i class="red status glyphicon glyphicon-remove-circle" title="' + i18n.Resources.LicenseStatusType_Active + '"></i>';
                case Enums.LicenseStatusType.enum.Expired:
                    return '<i class="orange status glyphicon glyphicon-exclamation-sign" title="' + i18n.Resources.LicenseStatusType_Active + '"></i>';
                case Enums.LicenseStatusType.enum.Inactive:
                    return '<i class="orange status glyphicon glyphicon-ban-circle" title="' + i18n.Resources.LicenseStatusType_Active + '"></i>';
                default:
                    return '<i class="brown status glyphicon glyphicon-bullhorn" title="' + i18n.Resources.ExpiredSoon + '"></i>';
            }
        },
    },
    user: {
        name: function (first, last) {
            return first + ' ' + last;
        },
        status: function (item) {
            item = item != null ? Enums.UserStatusType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        role: function (item) {
            item = item != null ? Enums.UserRoleType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        }
    },
    pantsOctopi: {
        size: function (item) {
            item = item != null ? Enums.SizeType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        }
    }
};