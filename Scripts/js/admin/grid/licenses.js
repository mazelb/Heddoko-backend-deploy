$(function () {
    Licenses.init();
});

var Licenses = {
    controls: {
        grid: null,
        filterModel: null,
        addModel: null
    },
    datasources: function () {
        //Datasources context

        this.licenseStatusTypes = new kendo.data.DataSource({
            data: _.values(Enums.LicenseStatusType.array)
        });

        this.licenseTypes = new kendo.data.DataSource({
            data: _.values(_.filter(Enums.LicenseType.array, function (u) { return u.value != 0 }))
        });

        this.licenses = Licenses.getDatasource();

        this.licenseDD = new kendo.data.DataSource({
            serverPaging: false,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/licenses'),
            schema: {
                data: "response",
                total: "total",
                errors: "Errors",
                model: {
                    id: "id"
                }
            },
            filter: [{
                field: 'Used',
                operator: 'eq',
                value: false
            }
            ]
        });
    },
    getDatasource: function () {
        return new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/licenses'),
            schema: {
                data: "response",
                total: "total",
                errors: "Errors",
                model: {
                    id: "id",
                    fields: {
                        id: {
                            editable: false,
                            nullable: true
                        },
                        type: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        status: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        amount: {
                            nullable: true,
                            type: "number",
                            validation: {
                                min: 1,
                                max: KendoDS.maxInt
                            }
                        },
                        expirationAt: {
                            nullable: false,
                            type: "date",
                            validation: {
                                required: true
                            }
                        }
                    }
                }
            }
        });
    },
    ddEditor: function (container, options) {
        $('<input required data-text-field="name" data-value-field="id"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.licenseDD
        });
    },
    statusDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.licenseStatusTypes
        });
    },
    typeDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.licenseTypes
        });
    },
    init: function () {
        var control = $("#licensesGrid");
        var filter = $('.licensesFilter');
        var model = $('.licensesForm');

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                dataSource: Datasources.licenses,
                sortable: false,
                editable: false,
                selectable: false,
                scrollable: false,
                resizable: true,
                autoBind: true,
                pageable: {
                    refresh: true,
                    pageSizes: [10, 50, 100]
                },
                columns: [
                    {
                        field: 'viewID',
                        title: i18n.Resources.ID,
                        editor: KendoDS.emptyEditor
                    }, {
                        field: 'type',
                        title: i18n.Resources.Type,
                        template: function (ed) {
                            return Format.license.type(ed.type);
                        },
                        editor: Licenses.typeDDEditor
                    }, {
                        field: 'amount',
                        title: i18n.Resources.Amount
                    }, {
                        field: 'status',
                        title: i18n.Resources.Status,
                        template: function (ed) {
                            return Format.license.status(ed.status);
                        },
                        editor: Licenses.statusDDEditor
                    }, {
                        field: 'expirationAt',
                        title: i18n.Resources.ExpirationAt,
                        editor: KendoDS.dateEditor,
                        format: "{0:yyyy-MM-dd}",
                        template: function (ed) {
                            return Format.license.expiredAt(ed.expirationAt);
                        }
                    }, {
                        field: 'used',
                        title: i18n.Resources.Used,
                        editor: KendoDS.emptyEditor,
                        template: function (ed) {
                            return Format.license.used(ed.used);
                        }
                    }
                ],
                save: KendoDS.onSave,
                dataBound: KendoDS.onDataBound
            }).data("kendoGrid");

            KendoDS.bind(this.controls.grid, true);

            this.controls.filterModel = kendo.observable({
                find: this.onFilter.bind(this),
                search: null,
                keyup: this.onEnter.bind(this)
            });

            kendo.bind(filter, this.controls.filterModel);
        }
    },
    getEmptyModel: function () {
        return {
            email: null,
            username: null,
            firstname: null,
            lastname: null
        };
    },
    onReset: function (e) {
        this.controls.addModel.set('model', this.getEmptyModel());
    },
    onAdd: function (e) {
        Notifications.clear();
        if (this.validators.addModel.validate()) {
            var obj = this.controls.addModel.get('model');

            this.controls.grid.dataSource.add(obj);
            this.controls.grid.dataSource.sync();
            this.controls.grid.dataSource.one('requestEnd', function (e) {
                if (e.type === "create") {
                    if (!e.response.Errors) {
                        this.onReset();
                    }
                }
            }.bind(this));
        }
    },
    onEnter: function (e) {
        if (e.keyCode == kendo.keys.ENTER) {
            this.onFilter(e);
        }
    },
    onFilter: function (e) {
        var filters = this.buildFilter();
        if (filters) {
            this.controls.grid.dataSource.filter(filters);
        }
    },
    buildFilter: function (search) {
        Notifications.clear();
        var search = this.controls.filterModel.search;

        var filters = [];

        if (typeof (search) !== "undefined"
         && search !== ""
         && search !== null) {
            filters.push({
                field: "Search",
                operator: "eq",
                value: search
            });
        }

        return filters.length == 0 ? {} : filters;
    }
};

Datasources.bind(Licenses.datasources);