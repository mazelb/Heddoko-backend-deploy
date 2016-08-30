$(function() {
    OrganizationKits.init();
});

var OrganizationKits = {
    isDeleted: false,
    controls: {
        form: null,
        grid: null,
        filterModel: null
    },

    init: function() {
        var control = $("#organizationKitsGrid");
        var filter = $(".organizationKitsFilter");
        this.controls.form = $(".organizationKitsForm");

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                    dataSource: Datasources.kits,
                    sortable: false,
                    editable: false,
                    selectable: false,
                    scrollable: false,
                    resizeable: true,
                    autoBind: true,
                    pageable: {
                        refresh: true,
                        pageSizes: [10, 50, 100]
                    },
                    columns: [
                        {
                            field: "idView",
                            title: i18n.Resources.ID,
                            editor: KendoDS.emptyEditor
                        },
                        {
                            field: "brainpackID",
                            title: i18n.Resources.Brainpack,
                            template: function(e) {
                                return Format.kit.brainpack(e);
                            }
                        },
                        {
                            field: "sensorSetID",
                            title: i18n.Resources.SensorSet,
                            template: function (e) {
                                return Format.kit.sensorSet(e);
                            }
                        },
                        {
                            field: "pantsID",
                            title: i18n.Resources.Pants,
                            template: function(e) {
                                return Format.kit.pants(e);
                            }
                        },
                        {
                            field: "shirtID",
                            title: i18n.Resources.Shirt,
                            template: function(e) {
                                return Format.kit.shirt(e);
                            }
                        },
                        {
                            field: "location",
                            title: i18n.Resources.PhysicalLocation
                        },
                        {
                            field: "status",
                            title: i18n.Resources.Status,
                            template: function(e) {
                                return Format.equipment.equipmentStatus(e.status);
                            }
                        }
                    ],
                    dataBound: KendoDS.onDataBound
                })
                .data("kendoGrid");

            KendoDS.bind(this.controls.grid, true);

            this.controls.filterModel = kendo.observable({
                find: this.onFilter.bind(this),
                search: null,
                keyup: this.onEnter.bind(this)
            });

            kendo.bind(filter, this.controls.filterModel);
        }
    },

    onEnter: function(e) {
        if (e.keycode === kendo.keys.ENTER) {
            this.onFilter(e);
        }
    },

    onFilter: function(e) {
        var filters = this.buildFilter();
        if (filters) {
            this.controls.grid.dataSource.filter(filters);
        }
    },

    buildFilter: function(search) {
        Notifications.clear();
        search = this.controls.filterModel.search;

        var filters = [];

        if (typeof (search) !== "undefined" && search !== "" && search !== null) {
            filters.push({
                field: "Search",
                operator: "eq",
                value: search
            });
        }

        return filters.length === 0 ? {} : filters;
    }
};