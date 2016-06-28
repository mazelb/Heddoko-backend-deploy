$(function () {
   
    Materials.init();
});

var Materials = {
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
        this.materials = new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/materials'),
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
                        name: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.material.name.maxLengthValidation
                            }
                        },
                        partNo: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.material.partNo.maxLengthValidation
                            }
                        },
                        materialTypeID: {
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

        this.materialsDD = new kendo.data.DataSource({
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/materials'),
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
    init: function () {
        var control = $("#gridMaterials");
        var filter = $('.materialsFilter');
        var model = $('.materialsForm');

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                dataSource: Datasources.materials,
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
                    field: 'name',
                    title: i18n.Resources.Name
                }, {
                    field: 'partNo',
                    title: i18n.Resources.PartNo
                }, {
                    field: 'materialTypeId',
                    title: i18n.Resources.MaterialType,
                    template: function (e) {
                        return e.materialTypeName
                    },
                    editor: MaterialTypes.ddEditor
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
                materialTypes: Datasources.materialTypesDD,
                model: this.getEmptyModel()
            });

            kendo.bind(model, this.controls.addModel);

            this.validators.addModel = model.kendoValidator({
                validateOnBlur: true,
                rules: {
                    maxLengthValidationName: Validator.material.name.maxLengthValidation,
                    maxLengthValidationPartNo: Validator.material.partNo.maxLengthValidation,
                }
            }).data("kendoValidator");
        }
    },
    ddEditor: function (container, options) {
        $('<input required data-text-field="name" data-value-field="id"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.materialsDD
        });
    },
    getEmptyModel: function () {
        return {
            name: null,
            partNo: null,
            materialTypeId: null
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

Datasources.bind(Materials.datasources);