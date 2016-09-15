$(function() {
    Brainpacks.init();
});

var Brainpacks = {
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
        //Datasources context
        this.brainpacks = Brainpacks.getDatasource();

        this.brainpacks.bind("requestEnd", function (e) {
            switch (e.type) {
                case "create":
                case "update":
                case "destroy":
                    Datasources.brainpacksDD.read();
                    break;
            }
        });

        this.brainpackQAStatusTypes = new kendo.data.DataSource({
            data: _.values(Enums.BrainpackQAStatusType.array)
        });

        this.brainpackQAStatusTypes.read();

        this.brainpacksDD = Brainpacks.getDatasourceDD();
    },

    getDatasource: function() {
        return new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport("/admin/api/brainpacks"),
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
                        version: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.equipment.version.maxLengthValidation
                            }
                        },
                        firmwareID: {
                            nullable: true,
                            type: "number",
                            validation: {
                                max: KendoDS.maxInt
                            }
                        },
                        powerboardID: {
                            nullable: true,
                            type: "number",
                            validation: {
                                max: KendoDS.maxInt
                            }
                        },
                        databoardID: {
                            nullable: true,
                            type: "number",
                            validation: {
                                max: KendoDS.maxInt
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
                        }
                    }
                }
            }
        });
    },

    getDatasourceDD: function(id) {
        return new kendo.data.DataSource({
            serverPaging: false,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/brainpacks'),
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

    init: function() {
        var control = $("#brainpacksGrid");
        var filter = $(".brainpacksFilter");
        this.controls.form = $(".brainpacksForm");

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                    dataSource: Datasources.brainpacks,
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
                            field: "firmwareID",
                            title: i18n.Resources.FirmwareVersion,
                            template: function(e) {
                                return Format.firmware.version(e);
                            },
                            editor: Firmwares.ddEditorBrainpacks
                        },
                        {
                            field: "powerboardID",
                            title: i18n.Resources.Powerboard,
                            template: function(e) {
                                return Format.brainpack.powerboard(e);
                            },
                            editor: Powerboards.ddEditor
                        },
                        {
                            field: "databoardID",
                            title: i18n.Resources.Databoard,
                            template: function(e) {
                                return Format.brainpack.databoard(e);
                            },
                            editor: Databoards.ddEditor
                        },
                        {
                            field: "version",
                            title: i18n.Resources.Version
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
                            },
                            editor: Equipments.equipmentStatusDDEditor
                        },
                        {
                            field: "qaStatus",
                            title: i18n.Resources.QAStatus,
                            template: function(e) {
                                return Format.brainpack.qaStatus(e.qaStatusText);
                            },
                            editor: KendoDS.emptyEditor
                        },
                        {
                            field: 'notes',
                            title: i18n.Resources.Notes,
                            editor: KendoDS.textAreaDDEditor
                        }, {
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
                    detailInit: this.detailInit.bind(this),
                    detailTemplate: kendo.template($("#brainpacks-qastatuses-template").html()),
                    dataBound: this.onDataBound
                })
                .data("kendoGrid");

            KendoDS.bind(this.controls.grid, true);

            this.controls.filterModel = kendo.observable({
                find: this.onFilter.bind(this),
                search: null,
                keyup: this.onEnter.bind(this)
            });

            kendo.bind(filter, this.controls.filterModel);

            this.controls.addModel = kendo.observable({
                reset: this.onReset.bind(this),
                submit: this.onAdd.bind(this),
                statuses: Datasources.equipmentStatusTypes,
                firmwares: Datasources.firmwaresBrainpacks,
                powerboards: Datasources.powerboardsDD,
                databoards: Datasources.databoardsDD,
                qaStatuses: Datasources.brainpackQAStatusTypes,
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

            $('.chk-show-deleted', this.controls.grid.element).click(this.onShowDeleted.bind(this));
        }
    },

    ddEditor: function(container, options) {
        $('<input required data-text-field="name" data-value-field="id" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Brainpacks.getDatasourceDD(options.model.id)
            });
    },

    onDataBound: function(e) {
        KendoDS.onDataBound(e);

        var grid = Brainpacks.controls.grid;
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

        var grid = Brainpacks.controls.grid;

        var item = grid.dataSource.get(this.get('id'));
        item.set('qaStatuses', model.toJSON());
        item.dirty = true;

        Brainpacks.controls.grid.dataSource.sync();
    },

    getEmptyModel: function() {
        return {
            version: null,
            firmwareID: null,
            databoardID: null,
            powerboardID: null,
            location: null,
            status: null,
            qaStatus: null,
            label: null,
            notes: null
        };
    },

    onShowDeleted: function(e) {
        this.isDeleted = $(e.currentTarget).prop("checked");
        this.onFilter();
    },

    onRestore: function(e) {
        var grid = Brainpacks.controls.grid;

        var item = grid.dataItem($(e.currentTarget).closest("tr"));
        item.set("status", Enums.EquipmentStatusType.enum.Ready);
        grid.dataSource.sync();
    },

    onReset: function(e) {
        this.controls.addModel.set("model", this.getEmptyModel());
    },

    showHistory: function (e) {
        var item = Brainpacks.controls.grid.dataItem($(e.currentTarget).closest("tr"));
        HistoryPopup.show('brainpacks/history/' + item.id);
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
                        Datasources.databoardsDD.read();
                        Datasources.powerboardsDD.read();
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

Datasources.bind(Brainpacks.datasources);