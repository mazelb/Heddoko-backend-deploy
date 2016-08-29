$(function() {
    Sensors.init();
});

var Sensors = {
    isDeleted: false,
    controls: {
        form: null,
        grid: null,
        filterModel: null,
        addModel: null
    },

    validators: {
        modelValidator: null
    },

    datasources: function() {
        this.sensors = Sensors.getDatasource();

        this.sensors.bind("requestEnd", function (e) {
            switch (e.type) {
                case "create":
                case "update":
                case "destroy":
                    Datasources.sensorsDD.read();
                    break;
            }
        });

        this.sensorsDD = Sensors.getDatasourceDD();

        this.sensorTypes = new kendo.data.DataSource({
            data: _.values(Enums.SensorType.array)
        });

        this.sensorTypes.read();

        this.sensorQAStatusTypes = new kendo.data.DataSource({
            data: _.values(Enums.SensorQAStatusType.array)
        });

        this.sensorQAStatusTypes.read();

        this.sensorsLinkDD = Sensors.getDatasourceLinkDD();
    },

    getDatasourceLinkDD: function(id) {
        return new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/sensors'),
            schema: {
                data: "response",
                total: "total",
                errors: "Errors",
                model: {
                    id: "id"
                }
            }
        });
    },

    getDatasourceDD: function(id) {
        return new kendo.data.DataSource({
            serverPaging: false,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/sensors'),
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
                    field: 'Used',
                    operator: 'eq',
                    value: id
                }
            ]
        });
    },

    getDatasource: function() {
        return new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/sensors'),
            schema: {
                data: "response",
                total: "total",
                errors: "Errors",
                model: {
                    id: "id",
                    fields: {
                        id: {
                            editable: false,
                            nullable: true,
                        },
                        type: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            },
                            editor: Sensors.typeDDEditor
                        },
                        version: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.equipment.version.maxLengthValidation
                            }
                        },
                        location: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.equipment.location.maxLengthValidation
                            }
                        },
                        firmwareID: {
                            nullable: false,
                            type: "number",
                            validation: {
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
                        qaStatus: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        sensorSet: {
                            nullable: true,
                            editable: false
                        },
                        anatomicalLocation: {
                            nullable: true,
                            type: "number",
                            validation: {
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

    typeDDEditor: function(container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.sensorTypes
            });
    },

    anatomicalLocationDDEditor: function(container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.anatomicalLocationTypes
            });
    },

    init: function() {
        var control = $("#sensorsGrid");
        var filter = $(".sensorsFilter");
        this.controls.form = $(".sensorsForm");

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                    dataSource: Datasources.sensors,
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
                                    '</span></div>'
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
                            field: "type",
                            title: i18n.Resources.Type,
                            template: function(e) {
                                return Format.sensors.type(e.type);
                            },
                            editor: Sensors.typeDDEditor
                        },
                        {
                            field: "version",
                            title: i18n.Resources.Version
                        },
                        {
                            field: "location",
                            title: i18n.Resources.Location
                        },
                        {
                            field: "firmwareID",
                            title: i18n.Resources.FirmwareVersion,
                            template: function(e) {
                                return Format.firmware.version(e);
                            },
                            editor: Firmwares.ddEditorSensors
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
                            field: "qaStatus",
                            title: i18n.Resources.QAStatus,
                            template: function (e) {
                                return Format.sensors.qaStatus(e.qaStatusText);
                            },
                            editor: KendoDS.emptyEditor
                        },
                        {
                            field: "sensorSet",
                            title: i18n.Resources.SensorSet,
                            template: function(e) {
                                return Format.kit.sensorSet(e);
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
                    detailInit: this.detailInit.bind(this),
                    detailTemplate: kendo.template($("#sensors-qastatuses-template").html()),
                    dataBound: this.onDataBound
                })
                .data("kendoGrid");

            KendoDS.bind(this.controls.grid, true);

            this.controls.filterModel = kendo.observable({
                find: this.onFilter.bind(this),
                search: null,
                keyup: this.onEnter.bind(this),
                statusFilter: null,
                statuses: Datasources.equipmentStatusTypes
            });

            kendo.bind(filter, this.controls.filterModel);

            this.controls.addModel = kendo.observable({
                reset: this.onReset.bind(this),
                submit: this.onAdd.bind(this),
                statuses: Datasources.equipmentStatusTypes,
                qaStatuses: Datasources.sensorQAStatusTypes,
                firmwares: Datasources.firmwaresSensors,
                sensorTypes: Datasources.sensorTypes,
                anatomicalLocations: Datasources.anatomicalLocationTypes,
                model: this.getEmptyModel()
            });

            kendo.bind(this.controls.form, this.controls.addModel);

            this.validators.addModel = this.controls.form.kendoValidator({
                    validateOnBlur: true,
                    rules: {
                        maxLengthValidationLocation: Validator.equipment.location.maxLengthValidation
                    }
                })
                .data("kendoValidator");

            $(".chk-show-deleted", this.controls.grid.element).click(this.onShowDeleted.bind(this));
        }
    },

    ddEditor: function(container, options) {
        $('<input required data-text-field="name" data-value-field="id" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Sensors.getDatasourceDD(options.model.id)
            });
    },

    onDataBound: function(e) {
        KendoDS.onDataBound(e);

        var grid = Sensors.controls.grid;
        var enumarable = Enums.EquipmentStatusType.enum;

        $(".k-grid-delete", grid.element)
            .each(function() {
                var currentDataItem = grid.dataItem($(this).closest("tr"));

                if (currentDataItem.status === enumarable.Trash) {
                    $(this).remove();
                }
            });

        $(".k-grid-edit", grid.element)
            .each(function() {
                var currentDataItem = grid.dataItem($(this).closest("tr"));

                if (currentDataItem.status === enumarable.Trash) {
                    $(this).remove();
                }
            });

        $(".k-grid-restore", grid.element)
            .each(function() {
                var currentDataItem = grid.dataItem($(this).closest("tr"));

                if (currentDataItem.status !== enumarable.Trash) {
                    $(this).remove();
                }
            });
    },

    detailInit: function (e) {
        var detailRow = e.detailRow;

        detailRow.find(".tabstrip").kendoTabStrip({
            animation: {
                open: { effects: "fadeIn" }
            }
        });

        var qaModel = _.zipObject(e.data.qaModel, _.map(e.data.qaModel, function (ev) { return true }));
        var model = kendo.observable({
            id: e.data.id,
            qamodel: qaModel,
            save: this.onSaveQAStatus
        });

        kendo.bind(detailRow.find('.qa-statuses'), model);
    },

    onSaveQAStatus: function (e) {
        var model = this.get('qamodel');

        var grid = Sensors.controls.grid;

        var item = grid.dataSource.get(this.get('id'));
        item.set('qaStatuses', model.toJSON());
        item.dirty = true;

        Sensors.controls.grid.dataSource.sync();
    },

    getEmptyModel: function() {
        return {
            type: null,
            version: null,
            location: null,
            firmwareID: null,
            status: null,
            qaStatus: null,
            sensorSet: null,
            anatomicalLocation: null,
            label: null,
            notes: null
        };
    },

    onShowDeleted: function(e) {
        this.isDeleted = $(e.currentTarget).prop("checked");
        this.onFilter();
    },

    onRestore: function(e) {
        var grid = Sensors.controls.grid;

        var item = grid.dataItem($(e.currentTarget).closest("tr"));
        item.set("status", Enums.EquipmentStatusType.enum.Ready);
        grid.dataSource.sync();
    },

    onReset: function(e) {
        this.controls.addModel.set("model", this.getEmptyModel());
    },

    onAdd: function(e) {
        Notifications.clear();
        if (this.validators.addModel.validate()) {
            var obj = this.controls.addModel.get("model");

            this.controls.grid.dataSource.add(obj);
            this.controls.grid.dataSource.sync();
            this.controls.grid.dataSource.one("requestEnd",
                function(ev) {
                    if (ev.type === "create" && !ev.response.Errors) {
                        this.onReset();
                    }
                }.bind(this));
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
        statusFilter = this.controls.filterModel.statusFilter;

        var filters = [];

        if (typeof (search) !== "undefined" && search !== "" && search !== null) {
            filters.push({
                field: "Search",
                operator: "eq",
                value: search
            });
        }

        if (typeof (statusFilter) === "number") {
            filters.push({
                field: "Status",
                operator: "eq",
                value: statusFilter
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

Datasources.bind(Sensors.datasources);