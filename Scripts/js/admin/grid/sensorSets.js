$(function () {
    SensorSets.init();
});

var SensorSets = {
    isDeleted: false,
    controls: {
        form: null,
        grid: null,
        filterModel: null,
        addModel: null,
        popup: null,
        popupModel: null
    },

    validators: {
        modelValidator: null
    },

    datasources: function () {
        this.sensorSets = SensorSets.getDatasource();

        this.sensorSets.bind("requestEnd", function (e) {
            switch (e.type) {
                case "create":
                case "update":
                case "destroy":
                    Datasources.sensorSetsDD.read();
                    break;
            }
        });

        this.sensorSetsDD = SensorSets.getDatasourceDD();
    },

    getDatasource: function () {
        return new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/sensorSets'),
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
                        kit: {
                            editable: false,
                            nullable: true
                        },
                        location: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.equipment.location.maxLengthValidation
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
                        label: {
                            nullable: true,
                            type: "string",
                            validation: {
                                maxLengthValidation: Validator.equipment.label.maxLengthValidation
                            }
                        },
                        notes: {
                            nullable: true,
                            type: "string",
                            validation: {
                                maxLengthValidation: Validator.equipment.notes.maxLengthValidation
                            }
                        }
                    }
                }
            }
        });
    },

    getDatasourceDD: function (id) {
        return new kendo.data.DataSource({
            serverPaging: false,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport("/admin/api/sensorSets"),
            schema: {
                data: "response",
                total: "total",
                errors: "Errors",
                model: {
                    id: "id"
                }
            },
            filter: [
                {
                    field: "Used",
                    operator: "eq",
                    value: id
                }
            ]
        });
    },

    init: function () {
        var control = $("#sensorSetsGrid");
        var filter = $(".sensorSetsFilter");
        var model = $(".sensorSetsForm");
        var popup = $('#sensorSetsPopup');
        var popupModel = $(".sensorSetsLinkForm");

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                dataSource: Datasources.sensorSets,
                sortable: false,
                editable: "popup",
                selectable: false,
                scrollable: false,
                resizeable: true,
                autoBind: true,
                pageable: {
                    refresh: true,
                    pageSizes: [10, 50, 100]
                },
                toolbar: [
                    {
                        template:
                            '<div class="grid-checkbox"><span><input class="chk-show-deleted" type="checkbox"/>' +
                                i18n.Resources.ShowDeleted +
                                "</span></div>"
                    }
                ],
                columns: [
                    {
                        field: "idView",
                        title: i18n.Resources.ID,
                        editor: KendoDS.emptyEditor
                    },
                    {
                        field: 'label',
                        title: i18n.Resources.Label
                    },
                    {
                        field: 'location',
                        title: i18n.Resources.PhysicalLocation
                    },
                    {
                        field: "status",
                        title: i18n.Resources.Status,
                        template: function(e) {
                            return Format.equipment.equipmentStatus(e.status);
                        },
                        editor: Equipments.equipmentStatusDDEditor
                    },
                    {
                        field: "kit",
                        title: i18n.Resources.Kit,
                        template: function (e) {
                            return Format.sensors.kit(e);
                        },
                        editor: KendoDS.emptyEditor
                    },
                    {
                        field: 'notes',
                        title: i18n.Resources.Notes,
                        editor: KendoDS.textAreaDDEditor
                    },
                    {
                        command: [
                            {
                                name: "edit",
                                text: i18n.Resources.Edit,
                                className: "k-grid-edit"
                            }, {
                                name: "destroy",
                                text: i18n.Resources.Delete,
                                className: "k-grid-delete"
                            }, {
                                text: i18n.Resources.History,
                                className: "k-grid-history",
                                click: this.showHistory
                            }, {
                                text: i18n.Resources.Restore,
                                className: "k-grid-restore",
                                click: this.onRestore
                            }
                        ],
                        title: i18n.Resources.Actions,
                        width: '165px'
                    }
                ],
                save: KendoDS.onSave,
                detailInit: this.detailInit,
                dataBound: this.onDataBound
            })
                .data("kendoGrid");

            KendoDS.bind(this.controls.grid, true);

            this.controls.filterModel = kendo.observable({
                find: this.onFilter.bind(this),
                search: null,
                keyup: this.onEnter(this)
            });

            kendo.bind(filter, this.controls.filterModel);

            this.controls.addModel = kendo.observable({
                reset: this.onReset.bind(this),
                submit: this.onAdd.bind(this),
                qaStatuses: Datasources.sensorSetQAStatusTypes,
                statuses: Datasources.equipmentStatusTypes,
                model: this.getEmptyModel()
            });

            kendo.bind(model, this.controls.addModel);

            $(document).on("click", ".k-overlay", this.onClosePopup.bind(this));

            this.controls.popup = popup.kendoWindow({
                title: i18n.Resources.Link + " " + i18n.Resources.Sensors,
                modal: true,
                pinned: true,
                visible: false,
                resizeable: false,
                draggable: false,
                actions: [
                    "Close"
                ]
            })
                .data("kendoWindow");

            this.controls.popupModel = kendo.observable({
                sensorSetID: null,
                model: this.getEmptyPopupModel(),
                sensors: Datasources.sensorsLinkDD,
                link: this.onLink,
                reference: null
            });

            kendo.bind(popupModel, this.controls.popupModel);

            this.validators.addModel = model.kendoValidator({
                validateOnBlur: true
            })
                .data("kendoValidator");

            this.validators.popupModel = popupModel.kendoValidator().data("kendoValidator");

            $(".chk-show-deleted", this.controls.grid.element).click(this.onShowDeleted.bind(this));
        }
    },

    detailInit: function (e) {
        var datasourceSensors = Sensors.getDatasource();

        var reference = "k-grid-link-" + e.data.id;

        var grid = $("<div>")
            .appendTo(e.detailCell)
            .kendoGrid({
                dataSource: datasourceSensors,
                sortable: false,
                editable: "popup",
                selectable: false,
                scrollable: false,
                resizeable: true,
                autoBind: false,
                pageable: {
                    refresh: true,
                    pageSizes: [10, 50, 100]
                },
                toolbar: [{
                    text: i18n.Resources.Link + " " + i18n.Resources.Sensors,
                    className: reference
                }
                ],
                columns: [
                    {
                        field: "idView",
                        title: i18n.Resources.ID,
                        editor: KendoDS.emptyEditor
                    },
                    {
                        field: "type",
                        title: i18n.Resources.Type,
                        template: function (e) {
                            return Format.sensors.type(e.type);
                        },
                        editor: KendoDS.emptyEditor
                    },
                    {
                        field: "version",
                        title: i18n.Resources.Version,
                        editor: KendoDS.emptyEditor
                    },
                    {
                        field: "location",
                        title: i18n.Resources.Location,
                        editor: KendoDS.emptyEditor
                    },
                    {
                        field: "firmware",
                        title: i18n.Resources.FirmwareVersion,
                        template: function (e) {
                            return Format.firmware.version(e);
                        },
                        editor: KendoDS.emptyEditor
                    },
                    {
                        field: "status",
                        title: i18n.Resources.Status,
                        template: function (e) {
                            return Format.equipment.equipmentStatus(e.status);
                        },
                        editor: KendoDS.emptyEditor
                    },
                    {
                        field: "qaStatus",
                        title: i18n.Resources.QAStatus,
                        template: function (e) {
                            return Format.sensors.qaStatus(e.qaStatusText);
                        },
                        editor: KendoDS.emptyEditor
                    },
                    {
                        field: "anatomicalLocation",
                        title: i18n.Resources.AnatomicalLocation,
                        template: function (e) {
                            return Format.equipment.anatomicalLocationImg(e.anatomicalLocation);
                        },
                        editor: Equipments.anatomicalLocationDDEditor
                    },
                    {
                        command: [
                                {
                                    name: "edit",
                                    text: i18n.Resources.Edit,
                                    className: "k-grid-edit"
                                },
                                {
                                    text: i18n.Resources.Unlink,
                                    className: "k-grid-unlink",
                                    click: SensorSets.onUnlink
                                }
                        ],
                        title: i18n.Resources.Actions,
                        width: "100px"
                    }
                ],
                save: KendoDS.onSave,
                dataBound: KendoDS.onDataBound
            })
            .data("kendoGrid");

        KendoDS.bind(grid, true);

        datasourceSensors.filter({
            field: "SensorSetID",
            operator: "eq",
            value: parseInt(e.data.id)
        });

        $("." + reference)
            .click(function (ev) {
                SensorSets.onResetPopup();
                SensorSets.controls.popupModel.set("model.id", e.data.id);
                SensorSets.controls.popupModel.set("reference", reference);

                SensorSets.onShowPopup();

                return false;
            });
    },

    onShowPopup: function (e) {
        this.controls.popup.open().center();
    },

    onClosePopup: function (e) {
        this.controls.popup.close();
    },

    onLink: function (e) {
        var model = SensorSets.controls.popupModel.get("model");
        var item = Datasources.sensorSets.get(model.id);
        item.set("sensors", model.sensors);
        Datasources.sensorSets.sync();
        Datasources.sensorsLinkDD.read();
        SensorSets.onClosePopup();
    },

    onUnlink: function (e) {
        e.preventDefault();
        var tr = $(e.currentTarget).closest("tr");
        var dataItem = this.dataItem(tr);
        tr.remove();

        Ajax.post("/admin/api/sensors/" + dataItem.id + "/unlink");
        Datasources.sensorsLinkDD.read();
    },

    onDataBound: function (e) {
        KendoDS.onDataBound(e);

        var grid = SensorSets.controls.grid;
        var enumarable = Enums.EquipmentStatusType.enum;

        $(".k-grid-delete", grid.element)
            .each(function () {
                var currentDataItem = grid.dataItem($(this).closest("tr"));
                if (currentDataItem.status === enumarable.Trash) {
                    $(this).remove();
                }
            });

        $(".k-grid-edit", grid.element)
            .each(function () {
                var currentDataItem = grid.dataItem($(this).closest("tr"));
                if (currentDataItem.status === enumarable.Trash) {
                    $(this).remove();
                }
            });

        $(".k-grid-restore", grid.element)
            .each(function () {
                var currentDataItem = grid.dataItem($(this).closest("tr"));

                if (currentDataItem.status !== enumarable.Trash) {
                    $(this).remove();
                }
            });
    },

    ddEditor: function (container, options) {
        $('<input data-text-field="name" data-value-field="id" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: SensorSets.getDatasourceDD(options.model.id)
            });
    },

    onResetPopup: function (e) {
        this.controls.popupModel.set('model', this.getEmptyPopupModel());
    },

    getEmptyPopupModel: function () {
        return {
            id: null,
            sensors: []
        };
    },

    getEmptyModel: function () {
        return {
            qaStatus: null,
            status: null,
            location: null,
            label: null,
            notes: null
        };
    },

    onShowDeleted: function (e) {
        this.isDeleted = $(e.currentTarget).prop("checked");
        this.onFilter();
    },

    onRestore: function (e) {
        var grid = SensorSets.controls.grid;

        var item = grid.dataItem($(e.currentTarget).closest("tr"));
        item.set("status", Enums.EquipmentStatusType.enum.Ready);
        grid.dataSource.sync();
    },

    onReset: function (e) {
        this.controls.addModel.set("model", this.getEmptyModel());
    },

    showHistory: function (e) {
        var item = SensorSets.controls.grid.dataItem($(e.currentTarget).closest("tr"));
        HistoryPopup.show('sensorSets/history/' + item.id)
    },

    onAdd: function (e) {
        Notifications.clear();
        if (this.validators.addModel.validate()) {
            var obj = this.controls.addModel.get("model");

            this.controls.grid.dataSource.add(obj);
            this.controls.grid.dataSource.sync();
            this.controls.grid.dataSource.one("requestEnd",
                function (ev) {
                    if (ev.type === "create" && !ev.response.Errors) {
                        this.onReset();
                    }
                }.bind(this));
        }
    },

    onEnter: function (e) {
        if (e.keycode === kendo.keys.ENTER) {
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
        search = this.controls.filterModel.search;

        var filters = [];

        if (typeof (search) !== "undefined" && search !== "" && search !== null) {
            filters.push({
                field: "Search",
                operator: "eq",
                value: search
            });
        }

        if (this.isDeleted) {
            filters.push({
                field: "IsDeleted",
                operator: "eq",
                value: true
            });
        }

        return filters.length === 0 ? {} : filters;
    }
};

Datasources.bind(SensorSets.datasources);