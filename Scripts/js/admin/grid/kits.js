$(function () {
    Kits.init();
});

var Kits = {
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

    datasources: function () {
        //Datasources context
        this.kits = Kits.getDatasource();

        this.kitsDD = Kits.getDatasourceDD();

        this.kitCompositionTypes = new kendo.data.DataSource({
            data: _.values(Enums.KitCompositionType.array)
        });

        this.kitCompositionTypes.read();

        this.kitQAStatusTypes = new kendo.data.DataSource({
            data: _.values(Enums.KitQAStatusType.array)
        });

        this.kitQAStatusTypes.read();
    },

    getDatasource: function () {
        return new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport("/admin/api/kits"),
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
                        brainpackID: {
                            nullable: true,
                            type: "number",
                            validation: {
                                max: KendoDS.maxInt
                            }
                        },
                        sensorSetID: {
                            nullable: true,
                            type: "number",
                            validation: {
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        shirtID: {
                            nullable: true,
                            type: "number",
                            validation: {
                                max: KendoDS.maxInt
                            }
                        },
                        pantsID: {
                            nullable: true,
                            type: "number",
                            validation: {
                                max: KendoDS.maxInt
                            }
                        },
                        organizationID: {
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
                        composition: {
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
            transport: KendoDS.buildTransport("/admin/api/kits"),
            schema: {
                data: "response",
                total: "total",
                errors: "Errors",
                model: {
                    id: "id"
                },
            },
            filter: [{
                field: 'Used',
                operator: 'eq',
                value: id
            }]
        });
    },

    init: function () {
        var control = $("#kitsGrid");
        var filter = $(".kitsFilter");
        this.controls.form = $(".kitsForm");

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                dataSource: Datasources.kits,
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
                toolbar: [{
                    template: '<div class="grid-checkbox"><span><input class="chk-show-deleted" type="checkbox"/>' + i18n.Resources.ShowDeleted + '</span></div>'
                }],
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
                    field: "organizationID",
                    title: i18n.Resources.Organization,
                    template: function (e) {
                        return Format.kit.organization(e);
                    },
                    editor: Organizations.ddEditor
                },
                {
                    field: "brainpackID",
                    title: i18n.Resources.Brainpack,
                    template: function (e) {
                        return Format.kit.brainpack(e);
                    },
                    editor: Brainpacks.ddEditor
                },
                {
                    field: "sensorSetID",
                    title: i18n.Resources.SensorSet,
                    template: function (e) {
                        return Format.kit.sensorSet(e);
                    },
                    editor: SensorSets.ddEditor
                },
                {
                    field: "pantsID",
                    title: i18n.Resources.Pants,
                    template: function (e) {
                        return Format.kit.pants(e);
                    },
                    editor: Pants.ddEditor
                },
                 {
                     field: "shirtID",
                     title: i18n.Resources.Shirt,
                     template: function (e) {
                         return Format.kit.shirt(e);
                     },
                     editor: Shirts.ddEditor
                 },
                {
                    field: "location",
                    title: i18n.Resources.PhysicalLocation
                },
                {
                    field: "status",
                    title: i18n.Resources.Status,
                    template: function (e) {
                        return Format.equipment.equipmentStatus(e.status);
                    },
                    editor: Equipments.equipmentStatusDDEditor
                }, {
                    field: "qaStatus",
                    title: i18n.Resources.QAStatus,
                    template: function (e) {
                        return Format.kit.qaStatus(e.qaStatus);
                    },
                    editor: this.qaStatusTypesDDEditor
                },
                {
                    field: "composition",
                    title: i18n.Resources.Composition,
                    template: function (e) {
                        return Format.kit.composition(e.composition);
                    },
                    editor: Kits.kitCompositionTypesDDEditor
                },
                {
                    field: 'notes',
                    title: i18n.Resources.Notes,
                    editor: KendoDS.textAreaDDEditor
                }, {
                    command: [{
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
                    }],
                    title: i18n.Resources.Actions,
                    width: '165px'
                }
                ],
                save: KendoDS.onSave,
                dataBound: this.onDataBound
            }).data("kendoGrid");

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
                organizations: Datasources.organizationsDD,
                brainpacks: Datasources.brainpacksDD,
                sensorSets: Datasources.sensorSetsDD,
                pants: Datasources.pantsDD,
                shirts: Datasources.shirtsDD,
                compositions: Datasources.kitCompositionTypes,
                qaStatuses: Datasources.kitQAStatusTypes,
                model: this.getEmptyModel()
            });

            kendo.bind(this.controls.form, this.controls.addModel);

            this.validators.addModel = this.controls.form.kendoValidator({
                validateOnBlur: true,
                rules: {
                    maxLengthValidationLocation: Validator.equipment.location.maxLengthValidation
                }
            }).data("kendoValidator");

            $('.chk-show-deleted', this.controls.grid.element).click(this.onShowDeleted.bind(this));
        }
    },

    onDataBound: function (e) {
        KendoDS.onDataBound(e);

        var grid = Kits.controls.grid;
        var enumarable = Enums.EquipmentStatusType.enum;

        $(".k-grid-delete", grid.element).each(function () {
            var currentDataItem = grid.dataItem($(this).closest("tr"));

            if (currentDataItem.status === enumarable.Trash) {
                $(this).remove();
            }
        });

        $(".k-grid-edit", grid.element).each(function () {
            var currentDataItem = grid.dataItem($(this).closest("tr"));

            if (currentDataItem.status === enumarable.Trash) {
                $(this).remove();
            }
        });

        $(".k-grid-restore", grid.element).each(function () {
            var currentDataItem = grid.dataItem($(this).closest("tr"));

            if (currentDataItem.status !== enumarable.Trash) {
                $(this).remove();
            }
        });
    },

    kitCompositionTypesDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.kitCompositionTypes
        });
    },

    ddEditor: function (container, options) {
        $('<input required data-text-field="name" data-value-field="id" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Kits.getDatasourceDD(options.model.id)
        });
    },

    qaStatusTypesDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.kitQAStatusTypes
            });
    },

    getEmptyModel: function () {
        return {
            organisationID: null,
            brainpackID: null,
            sensorSetID: null,
            pantsID: null,
            status: null,
            shirtID: null,
            location: null,
            composition: null,
            qaStatus: null,
            label: null,
            notes: null
        };
    },

    onShowDeleted: function (e) {
        this.isDeleted = $(e.currentTarget).prop("checked");
        this.onFilter();
    },

    onRestore: function (e) {
        var grid = Kits.controls.grid;

        var item = grid.dataItem($(e.currentTarget).closest("tr"));
        item.set("status", Enums.EquipmentStatusType.enum.Ready);
        grid.dataSource.sync();
    },

    onReset: function (e) {
        this.controls.addModel.set("model", this.getEmptyModel());
    },

    onAdd: function (e) {
        Notifications.clear();
        if (this.validators.addModel.validate()) {
            var obj = this.controls.addModel.get("model");

            this.controls.grid.dataSource.add(obj);
            this.controls.grid.dataSource.sync();
            this.controls.grid.dataSource.one("requestEnd", function (ev) {
                if (ev.type === "create"
                && !ev.response.Errors) {
                    Datasources.brainpacksDD.read();
                    Datasources.pantsDD.read();
                    Datasources.shirtsDD.read();
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

        if (typeof (search) !== "undefined"
         && search !== ""
         && search !== null) {
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

Datasources.bind(Kits.datasources);
