﻿var Format = {
    image: function (url) {
        return url ? '<img class="img-grid" src="' + url + '" />' : '&nbsp;';
    },
    equipment: {
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
        prototype: function (item) {
            item = item != null ? Enums.PrototypeType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        condition: function (item) {
            item = item != null ? Enums.ConditionType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        numbers: function (item) {
            item = item != null ? Enums.NumbersType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        heatsShrink: function (item) {
            item = item != null ? Enums.HeatsShrinkType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        ship: function (item) {
            item = item != null ? Enums.ShipType.array[item].text : "";

            return '<span class="k-grid-showText">' + item + '</span>';
        },
        notes: function (item) {
            var text =  item ? item.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\n/g, '<br/>') : '';
            var div = '<div class="grid-notes">'
            div += text;
            div += "</div>";
            return div;
        }
    }
};