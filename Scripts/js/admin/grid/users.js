$(function () {
    Users.init();
});

var Users = {
    controls: {
        grid: null,
        filterModel: null,
        addModel: null
    },
    validators: {
        addModel: null
    },
    datasources: function () {
        //Datasources context
        this.usersDD = new kendo.data.DataSource({
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/users'),
            schema: {
                data: "response",
                total: "total",
                errors: "Errors",
                model: {
                    id: "id"
                }
            },
            filter: [{
                field: 'Admin',
                operator: 'eq',
                value: false
            }]
        });

        this.userStatusTypes = new kendo.data.DataSource({
            data: _.values(Enums.UserStatusType.array)
        });

        this.users = Users.getDatasource();
    },
    ddEditor: function (container, options) {
        $('<input required data-text-field="name" data-value-field="id"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.usersDD
        });
    },
    getDatasource: function () {
        return new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/users'),
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
                        email: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true
                            }
                        },
                        username: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true
                            }
                        },
                        firstname: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true
                            }
                        },
                        lastname: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true
                            }
                        },
                        phone: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true
                            }
                        },
                        licenseID: {
                            nullable: false,
                            type: "numer",
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
                        }
                    }
                }
            }
        });
    },
    init: function () {
        var control = $("#usersGrid");
        var filter = $('.usersFilter');
        var model = $('.usersForm');

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                dataSource: Datasources.users,
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
                    title: i18n.Resources.Name,
                    editor: KendoDS.emptyEditor
                }, {
                    field: 'phone',
                    title: i18n.Resources.Phone,
                    editor: KendoDS.emptyEditor
                }, {
                    field: 'username',
                    title: i18n.Resources.Username,
                    editor: KendoDS.emptyEditor
                }, {
                    field: 'email',
                    title: i18n.Resources.Email,
                    editor: KendoDS.emptyEditor
                }, {
                    field: 'role',
                    title: i18n.Resources.Role,
                    editor: KendoDS.emptyEditor,
                    template: function (e) {
                        return Format.user.role(e.role);
                    }
                }, {
                    field: 'licenseID',
                    title: i18n.Resources.License,
                    editor: Licenses.ddEditor,
                    template: function (e) {
                        return Format.license.name(e.licenseName);
                    }
                }, {
                    field: 'status',
                    title: i18n.Resources.Status,
                    editor: KendoDS.emptyEditor,
                    template: function (e) {
                        return Format.user.status(e.status);
                    }
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
                detailInit: this.detailInit,
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
                model: this.getEmptyModel()
            });

            kendo.bind(model, this.controls.addModel);

            this.validators.addModel = model.kendoValidator({
                validateOnBlur: true,
                rules: {
                    maxLengthValidationName: Validator.organization.name.maxLengthValidation,
                    maxLengthValidationPhone: Validator.organization.phone.maxLengthValidation,
                    maxLengthValidationAddress: Validator.organization.address.maxLengthValidation,
                    maxLengthValidationNotes: Validator.organization.notes.maxLengthValidation
                }
            }).data("kendoValidator");
        }
    },
    statusDDEditor: function (container, options) {
        $('<input required data-text-field="text" data-value-field="value"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.userStatusTypes
        });
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

Datasources.bind(Users.datasources);