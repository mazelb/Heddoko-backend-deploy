$(function () {
    Users.init();
});

var Users = {
    isDeleted: false,
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
        this.usersAdminDD = new kendo.data.DataSource({
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
            data: _.values(_.filter(Enums.UserStatusType.array, function (u) { return u.value != Enums.UserStatusType.enum.Banned && u.value != Enums.UserStatusType.enum.Deleted }))
        });

        this.users = Users.getDatasource();

        this.usersDD = Users.getDatasourceDD();
    },

    getDatasourceDD: function (id) {
        return new kendo.data.DataSource({
            serverPaging: false,
            serverFiltering: true,
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
            filter: [
                {
                    field: 'Used',
                    operator: 'eq',
                    value: id
                }
            ]
        });
    },

    ddEditor: function (container, options) {
        $('<input required data-text-field="name" data-value-field="id"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.usersAdminDD
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
                            nullable: true,
                            type: "numer",
                            validation: {
                                required: true,
                                min: 0,
                                max: KendoDS.maxInt
                            }
                        },
                        kitID: {
                            nullable: true,
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
                toolbar: [{
                    template: '<div class="grid-checkbox"><span><input id="chk-show-deleted" type="checkbox"/>' + i18n.Resources.ShowDeleted + '</span></div>'
                }],
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
                        var name = '';
                        if (e.licenseName) {
                            name = Format.license.status(e.licenseStatus, e.expirationAt, true);
                        }

                        name += ' ' + Format.license.name(e.licenseName);;

                        return name;
                    }
                }, {
                    field: 'kitID',
                    title: i18n.Resources.Kit,
                    editor: Kits.ddEditor,
                    template: function (e) {
                        return Format.user.kit(e);
                    }
                }, {
                    field: 'status',
                    title: i18n.Resources.Status,
                    editor: Users.statusDDEditor,
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
                detailInit: this.detailInit,
                dataBound: this.onDataBound
            }).data("kendoGrid");

            KendoDS.bind(this.controls.grid, true);

            var licenses = Licenses.getDatasource();

            this.controls.filterModel = kendo.observable({
                find: this.onFilter.bind(this),
                search: null,
                keyup: this.onEnter.bind(this),
                license: null,
                licenses: licenses,
                click: this.onFilter.bind(this)
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

            $('#chk-show-deleted', Users.controls.grid.element).click(this.onShowDeleted.bind(this));
        }
    },
    onDataBound: function (e) {
        KendoDS.onDataBound(e);

        $(".k-grid-delete", Users.controls.grid.element).each(function () {
            var currentDataItem = Users.controls.grid.dataItem($(this).closest("tr"));
            if (currentDataItem) {
                if (currentDataItem.status == Enums.UserStatusType.enum.Deleted) {
                    $(this).remove();
                }
            }
        });

        $(".k-grid-edit", Users.controls.grid.element).each(function () {
            var currentDataItem = Users.controls.grid.dataItem($(this).closest("tr"));
            if (currentDataItem) {
                if (currentDataItem.status == Enums.UserStatusType.enum.Deleted) {
                    $(this).remove();
                }
            }
        });

        $(".k-grid-restore", Users.controls.grid.element).each(function () {
            var currentDataItem = Users.controls.grid.dataItem($(this).closest("tr"));
            if (currentDataItem) {
                if (currentDataItem.status != Enums.UserStatusType.enum.Deleted) {
                    $(this).remove();
                }
            }
        });
    },
    onShowDeleted: function (e) {
        this.isDeleted = $(e.currentTarget).prop('checked');
        this.onFilter();
    },
    onRestore: function (e) {
        var item = Users.controls.grid.dataItem($(e.currentTarget).closest("tr"));
        item.set('status', Enums.UserStatusType.enum.Active);
        Users.controls.grid.dataSource.sync();
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
        var license = this.controls.filterModel.license;

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

        if (typeof (license) !== "undefined"
          && license !== ""
          && license !== null) {
            filters.push({
                field: "License",
                operator: "eq",
                value: license
            });
        }

        if (this.isDeleted) {
            filters.push({
                field: "IsDeleted",
                operator: "eq",
                value: true
            });
        }

        return filters.length == 0 ? {} : filters;
    }
};

Datasources.bind(Users.datasources);