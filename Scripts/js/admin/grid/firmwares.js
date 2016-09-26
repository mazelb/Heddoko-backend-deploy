$(function() {
    Firmwares.init();
});

var Firmwares = {
    isDeleted: false,
    controls: {
        form: null,
        grid: null,
        filterModel: null,
        addModel: null,
        btnUpload: null
    },

    validators: {
        modelValidator: null
    },

    datasources: function() {
        //Datasources context
        this.firmwares = Firmwares.getDatasource();

        this.firmwaresBrainpacks = Firmwares.getDatasourceDD(Enums.FirmwareType.enum.Brainpack);

        this.firmwaresDataboards = Firmwares.getDatasourceDD(Enums.FirmwareType.enum.Databoard);

        this.firmwaresPowerboards = Firmwares.getDatasourceDD(Enums.FirmwareType.enum.Powerboard);

        this.firmwaresSensors = Firmwares.getDatasourceDD(Enums.FirmwareType.enum.Sensor);

        this.firmwareTypes = new kendo.data.DataSource({
            data: _.values(Enums.FirmwareType.array)
        });

        this.firmwareTypes.read();

        this.firmwareStatusTypes = new kendo.data.DataSource({
            data: _.values(Enums.FirmwareStatusType.array)
        });

        this.firmwareStatusTypes.read();
    },

    getDatasourceDD: function(id) {
        return new kendo.data.DataSource({
            serverPaging: false,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/firmwares'),
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
            transport: KendoDS.buildTransport('/admin/api/firmwares'),
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
                                max: KendoDS.maxInt
                            }
                        },
                        version: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.equipment.version.maxLengthValidation
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
                        }
                    }
                }
            }
        });
    },

    init: function() {
        var control = $('#firmwaresGrid');
        var filter = $('.firmwaresFilter');
        this.controls.form = $('.firmwaresForm');

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                    dataSource: Datasources.firmwares,
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
                            field: 'idView',
                            title: i18n.Resources.ID,
                            editor: KendoDS.emptyEditor
                        },
                        {
                            field: 'type',
                            title: i18n.Resources.Type,
                            template: function(e) {
                                return Format.firmware.type(e.type);
                            },
                            editor: Firmwares.typeDDEditor
                        },
                        {
                            field: 'version',
                            title: i18n.Resources.Version
                        },
                        {
                            field: 'status',
                            title: i18n.Resources.Status,
                            template: function(e) {
                                return Format.firmware.status(e.status);
                            },
                            editor: Firmwares.statusDDEditor
                        },
                        {
                            field: 'url',
                            title: i18n.Resources.Url,
                            template: function(e) {
                                return Format.firmware.url(e.url);
                            },
                            editor: KendoDS.emptyEditor
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
                types: Datasources.firmwareTypes,
                statuses: Datasources.firmwareStatusTypes,
                select: this.onSelectUpload.bind(this),
                upload: this.onUpload.bind(this),
                success: this.onSuccessUpload.bind(this),
                model: this.getEmptyModel()
            });

            kendo.bind(this.controls.form, this.controls.addModel);

            this.validators.addModel = this.controls.form.kendoValidator({
                    validateonBlur: true,
                    rules: {
                        maxLengthValidationLocation: Validator.equipment.location.maxLengthValidation
                    }
                })
                .data("kendoValidator");

            $('.chk-show-deleted', this.controls.grid.element).click(this.onShowDeleted.bind(this));
        }
    },

    onDataBound: function(e) {
        KendoDS.onDataBound(e);

        var grid = Firmwares.controls.grid;
        var enumarable = Enums.FirmwareStatusType.enum;

        $(".k-grid-delete", grid.element)
            .each(function() {
                var currentDataItem = grid.dataItem($(this).closest("tr"));

                if (currentDataItem.status == enumarable.Inactive) {
                    $(this).remove();
                }
            });

        $(".k-grid-edit", grid.element)
            .each(function() {
                var currentDataItem = grid.dataItem($(this).closest("tr"));

                if (currentDataItem.status == enumarable.Inactive) {
                    $(this).remove();
                }
            });

        $(".k-grid-restore", grid.element)
            .each(function() {
                var currentDataItem = grid.dataItem($(this).closest("tr"));

                if (currentDataItem.status != enumarable.Inactive) {
                    $(this).remove();
                }
            });
    },

    ddEditorBrainpacks: function(container, options) {
        $('<input required data-text-field="name" data-value-field="id" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.firmwaresBrainpacks
            });
    },

    ddEditorDataboards: function(container, options) {
        $('<input required data-text-field="name" data-value-field="id" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.firmwaresDataboards
            });
    },

    ddEditorPowerboards: function(container, options) {
        $('<input required data-text-field="name" data-value-field="id" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.firmwaresPowerboards
            });
    },

    ddEditorSensors: function(container, options) {
        $('<input required data-text-field="name" data-value-field="id" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.firmwaresSensors
            });
    },

    typeDDEditor: function(container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.firmwareTypes
            });
    },

    statusDDEditor: function(container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.firmwareStatusTypes
            });
    },

    getEmptyModel: function() {
        return {
            type: null,
            status: null,
            version: null
        };
    },

    onSelectUpload: function(e) {
        setTimeout(this.onSelectTimeout.bind(this), 1);
    },

    onSelectTimeout: function(e) {
        this.controls.btnUpload = $(".k-upload-selected", this.controls.form);
        this.controls.btnUpload.hide();
    },

    onShowDeleted: function(e) {
        this.isDeleted = $(e.currentTarget).prop('checked');
        this.onFilter();
    },

    onRestore: function(e) {
        var item = Firmwares.controls.grid.dataItem($(e.currentTarget).closest("tr"));
        item.set('status', Enums.EquipmentStatusType.enum.Ready);
        Firmwares.controls.grid.dataSource.sync();
    },

    onReset: function(e) {
        this.controls.addModel.set('model', this.getEmptyModel());
        KendoDS.resetUpload();
    },

    onAdd: function(e) {
        Notifications.clear();
        if (this.validators.addModel.validate()) {
            if (!this.controls.btnUpload) {
                Notifications.error(i18n.Resources.PleaseChooseFileForUpload);
            } else {
                this.controls.btnUpload.trigger('click');
            }
        }
    },

    onUpload: function(e) {
        if (e.files.length === 0) {
            Notifications.error(i18n.Resources.PleaseChooseFileForUpload);
            return false;
        } else {
            e.data = {
                type: this.controls.addModel.model.type,
                status: this.controls.addModel.model.status,
                version: this.controls.addModel.model.version,
            };
        }
    },

    onSuccessUpload: function(e) {
        this.onReset();
        this.controls.grid.dataSource.read();
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

Datasources.bind(Firmwares.datasources);