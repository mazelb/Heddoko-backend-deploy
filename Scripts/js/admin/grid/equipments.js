

$(function () {
    Equipments.init();
});

var Equipments = {
    controls: {
        grid: null,
        filterModel: null,
        addModel: null
    },
    validators: {
        modelValidator: null
    },
    datasources: function () {
        //Datasources context

        this.equipmentStatusTypes = new kendo.data.DataSource({
            data: _.values(Enums.EquipmentStatusType.array)
        });

        this.equipmentStatusTypes.read();

        this.anatomicalPositionTypes = new kendo.data.DataSource({
            data: _.values(Enums.AnatomicalPositionType.array)
        });

        this.anatomicalPositionTypes.read();

        this.prototypeTypes = new kendo.data.DataSource({
            data: _.values(Enums.PrototypeType.array)
        });

        this.prototypeTypes.read();

        this.conditionTypes = new kendo.data.DataSource({
            data: _.values(Enums.ConditionType.array)
        });

        this.conditionTypes.read();

        this.numbersTypes = new kendo.data.DataSource({
            data: _.values(Enums.NumbersType.array)
        });

        this.numbersTypes.read();

        this.heatsShrinkTypes = new kendo.data.DataSource({
            data: _.values(Enums.HeatsShrinkType.array)
        });

        this.heatsShrinkTypes.read();

        this.shipTypes = new kendo.data.DataSource({
            data: _.values(Enums.ShipType.array)
        });

        this.shipTypes.read();

        this.equipments = Equipments.getDatasource();
    },
    getDatasource: function(){
        return new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/equipments'),
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
                        macAddress: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.equipment.macAddress.maxLengthValidation
                            }
                        },
                        serialNo: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.equipment.serialNo.maxLengthValidation
                            }
                        },
                        physicalLocation: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.equipment.physicalLocation.maxLengthValidation
                            }
                        },
                        notes: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
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
                        anatomicalPosition: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        prototype: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        condition: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        numbers: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        heatsShrink: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        ship: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        materialID: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 1,
                                max: KendoDS.maxInt
                            }
                        },
                        verifiedByID: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 1,
                                max: KendoDS.maxInt
                            }
                        }
                    }
                }
            }
        });
    },
    init: function () {
        var control = $("#gridEquipments");
        var filter = $('.equipmentsFilter');
        var model = $('.equipmentsForm');

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                dataSource: Datasources.equipments,
                sortable: false,
                editable: "popup",
                selectable: false,
                scrollable: false,
                resizable: true,
                autoBind: true,
                pageable: {
                    refresh: true,
                    pageSizes: [10, 50, 100]
                },
                columns: [{
                    field: 'macAddress',
                    title: i18n.Resources.MacAddress
                }, {
                    field: 'serialNo',
                    title: i18n.Resources.SerialNo
                }, {
                    field: 'status',
                    title: i18n.Resources.Status,
                    template: function(e) {
                        return Format.equipment.status(e.status);
                    },
                    editor: this.statusDDEditor,
                    hidden: true
                }, {
                    field: 'physicalLocation',
                    title: i18n.Resources.PhysicalLocation
                }, {
                    field: 'anatomicalPosition',
                    title: i18n.Resources.AnatomicalPosition,
                    template: function (e) {
                        return Format.equipment.anatomicalPositionImg(e.anatomicalPosition);
                    },
                    editor: this.anatomicalPositionDDEditor
                }, {
                    field: 'prototype',
                    title: i18n.Resources.Prototype,
                    template: function (e) {
                        return Format.equipment.prototype(e.prototype);
                    },
                    editor: this.prototypeDDEditor,
                    hidden: true
                }, {
                    field: 'condition',
                    title: i18n.Resources.Condition,
                    template: function (e) {
                        return Format.equipment.condition(e.condition);
                    },
                    editor: this.conditionDDEditor,
                    hidden: true
                }, {
                    field: 'numbers',
                    title: i18n.Resources.Numbers,
                    template: function (e) {
                        return Format.equipment.numbers(e.numbers);
                    },
                    editor: this.numbersDDEditor,
                    hidden: true
                }, {
                    field: 'heatsShrink',
                    title: i18n.Resources.HeatsShrink,
                    template: function (e) {
                        return Format.equipment.heatsShrink(e.heatsShrink);
                    },
                    editor: this.heatsShrinkDDEditor,
                    hidden: true
                }, {
                    field: 'ship',
                    title: i18n.Resources.Ship,
                    template: function (e) {
                        return Format.equipment.ship(e.ship);
                    },
                    editor: this.shipDDEditor,
                    hidden: true
                }, {
                    field: 'materialID',
                    title: i18n.Resources.Material,
                    template: function (e) {
                        return e.materialName
                    },
                    editor: Materials.ddEditor,
                    hidden: true
                }, {
                    field: 'empty',
                    title: i18n.Resources.Information,
                    template: function (e) {
                        var div = "<div>"
                        div += i18n.Resources.Status + ': <strong>' + Format.equipment.status(e.status) + '</strong><br/>';
                        div += i18n.Resources.AnatomicalPosition + ': <strong>' + Format.equipment.anatomicalPosition(e.anatomicalPosition) + '</strong><br/>';
                        div += i18n.Resources.Material + ': <strong>' + e.materialName + '</strong><br/>';
                        div += i18n.Resources.Ship + ': <strong>' + Format.equipment.ship(e.ship) + '</strong><br/>';
                        div += i18n.Resources.HeatsShrink + ': <strong>' + Format.equipment.heatsShrink(e.heatsShrink) + '</strong><br/>';
                        div += i18n.Resources.Numbers + ': <strong>' + Format.equipment.numbers(e.numbers) + '</strong><br/>';
                        div += i18n.Resources.Condition + ': <strong>' + Format.equipment.condition(e.condition) + '</strong><br/>';
                        div += i18n.Resources.Prototype + ': <strong>' + Format.equipment.prototype(e.prototype) + '</strong>';
                        div += "</div>"

                        return div;
                    },
                    editor: KendoDS.emptyEditor
                }, {
                    field: 'verifiedByID',
                    title: i18n.Resources.VerifiedBy,
                    template: function (e) {
                        return e.verifiedByName
                    },
                    editor: Users.ddEditor
                }, {
                    field: 'notes',
                    title: i18n.Resources.Notes,
                    template: function(e) {
                        return Format.equipment.notes(e.notes)
                    },
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
                    }],
                    title: i18n.Resources.Actions,
                    width: '165px'
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

            this.controls.addModel = kendo.observable({
                reset: this.onReset.bind(this),
                submit: this.onAdd.bind(this),
                users: Datasources.usersDD,
                materials: Datasources.materialsDD,
                anatomicalPositions: Datasources.anatomicalPositionTypes,
                statuses: Datasources.equipmentStatusTypes,
                prototypes: Datasources.prototypeTypes,
                conditions: Datasources.conditionTypes,
                numbers: Datasources.numbersTypes,
                heatsShrinks: Datasources.heatsShrinkTypes,
                ships: Datasources.shipTypes,
                model: this.getEmptyModel()
            });

            kendo.bind(model, this.controls.addModel);

            this.validators.addModel = model.kendoValidator({
                validateOnBlur: true,
                rules: {
                    maxLengthValidationMacAddress: Validator.equipment.macAddress.maxLengthValidation,
                    maxLengthValidationSerialNo: Validator.equipment.serialNo.maxLengthValidation,
                    maxLengthValidationPhysicalLocation: Validator.equipment.physicalLocation.maxLengthValidation,
                    maxLengthValidationNotes: Validator.equipment.notes.maxLengthValidation,

                }
            }).data("kendoValidator");
        }
    },
    statusDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.equipmentStatusTypes
        });
    },
    anatomicalPositionDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.anatomicalPositionTypes
        });
    },
    prototypeDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.prototypeTypes
        });
    },
    conditionDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.conditionTypes
        });
    },
    numbersDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.numbersTypes
        });
    },
    heatsShrinkDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.heatsShrinkTypes
        });
    },
    shipDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.shipTypes
        });
    },
    getEmptyModel: function () {
        return {
            serialNo: null,
            macAddress: null,
            physicalLocation: null,
            notes: null,
            materialID: null,
            anatomicalPosition: null,
            status: null,
            prototype: null,
            condition: null,
            numbers: null,
            heatsShrink: null,
            ship: null,
            verifiedByID: null
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

Datasources.bind(Equipments.datasources);