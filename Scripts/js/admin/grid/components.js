$(function () {
    ComponentItems.init();
});

var ComponentItems = {
    isDeleted: false,
    controls: {
        grid: null,
        filterModel: null,
        addModel: null
    },

    validators: {
        modelValidator: null
    },

    datasources: function () {
        this.components = ComponentItems.getDatasource();

        this.componentTypes = new kendo.data.DataSource({
            data: _.values(Enums.ComponentsType.array)
        });

        this.componentTypes.read();
    },

    getDatasource: function () {
        return new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/components'),
            schema: {
                data: "response",
                total: "total",
                errors: "Errors",
                model: {
                    id: "id",
                    fields: {
                        type: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
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
                        quantity: {
                            nullable: false,
                            type: "number",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        location: {
                            nullable: true,
                            type: "text",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.equipment.location.maxLengthValidation
                            }
                        }
                    }
                }
            }
        });
    },

    init: function () {
        var control = $("#componentsGrid");
        var filter = $('.componentsFilter');
        var model = $('.componentsForm');

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                dataSource: Datasources.components,
                sortable: false,
                editable: "popup",
                selectable: false,
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
                        field: "type",
                        title: i18n.Resources.Type,
                        template: function (e) {
                            return Format.components.componentsType(e.type);
                        },
                        editor: this.typeDDEditor
                    },
                    {
                        field: 'status',
                        title: i18n.Resources.Status,
                        template: function (e) {
                            return Format.equipment.equipmentStatus(e.status);
                        },
                        editor: Equipments.equipmentStatusDDEditor
                    },
                    {
                        field: 'quantity',
                        title: i18n.Resources.Quantity
                    },
                    {
                        field: 'location',
                        title: i18n.Resources.Location
                    },
                    {
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
                types: Datasources.componentTypes,
                statuses: Datasources.equipmentStatusTypes,
                model: this.getEmptyModel()
            });

            this.validators.addModel = model.kendoValidator({
                validateonBlur: true,
                rules: {
                    maxLengthValidationLocation: Validator.equipment.location.maxLengthValidation
                }
            }).data("kendoValidator");

            kendo.bind(model, this.controls.addModel);

            $('.chk-show-deleted', this.controls.grid.element).click(this.onShowDeleted.bind(this));
        }
    },

    typeDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.componentTypes
        });
    },

    onDataBound: function (e) {
        KendoDS.onDataBound(e);

        var grid = ComponentItems.controls.grid;
        var enumarable = Enums.EquipmentStatusType.enum;

        $(".k-grid-delete", grid.element).each(function () {
            var currentDataItem = grid.dataItem($(this).closest("tr"));

            if (currentDataItem.status == enumarable.Trash) {
                $(this).remove();
            }
        });

        $(".k-grid-edit", grid.element).each(function () {
            var currentDataItem = grid.dataItem($(this).closest("tr"));

            if (currentDataItem.status == enumarable.Trash) {
                $(this).remove();
            }
        });

        $(".k-grid-restore", grid.element).each(function () {
            var currentDataItem = grid.dataItem($(this).closest("tr"));

            if (currentDataItem.status != enumarable.Trash) {
                $(this).remove();
            }
        });
    },

    getEmptyModel: function (e) {
        return {
            type: null,
            status: null,
            quantity: null
        };
    },

    onShowDeleted: function (e) {
        this.isDeleted = $(e.currentTarget).prop('checked');
        this.onFilter();
    },

    onRestore: function (e) {
        var item = ComponentItems.controls.grid.dataItem($(e.currentTarget).closest("tr"));
        item.set('status', Enums.EquipmentStatusType.enum.Ready);
        ComponentItems.controls.grid.dataSource.sync();
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
                if (e.type === "create" && !e.response.Errors) {
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

        if (typeof (search) !== "undefinded"
            && search !== ""
            && search !== null) {
            filter.push({
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

Datasources.bind(ComponentItems.datasources);
