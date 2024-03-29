﻿$(function () {
    Organizations.init();
});

var Organizations = {
    isDeleted: false,
    controls: {
        grid: null,
        filterModel: null,
        addModel: null,
        popup: null,
        popupModel: null
    },
    validators: {
        addModel: null
    },
    datasources: function () {
        //Datasources context
        this.organizations = new kendo.data.DataSource({
            pageSize: KendoDS.pageSize,
            serverPaging: true,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/organizations'),
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
                                maxLengthValidation: Validator.organization.name.maxLengthValidation
                            }
                        },
                        phone: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.organization.phone.maxLengthValidation
                            }
                        },
                        address: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.organization.address.maxLengthValidation
                            }
                        },
                        notes: {
                            nullable: false,
                            type: "string",
                            validation: {
                                required: true,
                                maxLengthValidation: Validator.organization.notes.maxLengthValidation
                            }
                        },
                        userid: {
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

        this.organizationsDD = Organizations.getDatasourceDD();
    },

    getDatasourceDD: function (id) {
        return new kendo.data.DataSource({
            serverPaging: false,
            serverFiltering: true,
            serverSorting: false,
            transport: KendoDS.buildTransport('/admin/api/organizations'),
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

    init: function () {
        var control = $("#organizationsGrid");
        var filter = $('.organizationsFilter');
        var model = $('.organizationsForm');
        var popup = $('#organizationsPopup');
        var popupModel = $(".organizationsPopupForm");

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                dataSource: Datasources.organizations,
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
                    }, {
                        field: 'name',
                        title: i18n.Resources.Name
                    }, {
                        field: 'phone',
                        title: i18n.Resources.Phone
                    }, {
                        field: 'address',
                        title: i18n.Resources.Address,
                        editor: KendoDS.textAreaDDEditor
                    }, {
                        field: 'userName',
                        title: i18n.Resources.Admin,
                        editor: KendoDS.emptyEditor,
                        template: function (e) {
                            return Format.organization.user(e);
                        }
                    }, {
                        field: 'notes',
                        title: i18n.Resources.Notes,
                        template: function (e) {
                            return Format.notes(e.notes);
                        },
                        editor: KendoDS.textAreaDDEditor
                    }, {
                        field: 'dataAnalysisAmount',
                        title: i18n.Resources.DataAnalysisAmount,
                        editor: KendoDS.emptyEditor
                    }, {
                        field: 'dataCollectorAmount',
                        title: i18n.Resources.DataCollectorAmount,
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
                                text: i18n.Resources.Admin,
                                className: "k-grid-admin",
                                click: this.onAdmin.bind(this)
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
                    maxLengthValidationEmail: Validator.organization.email.maxLengthValidation,
                    maxLengthValidationName: Validator.organization.name.maxLengthValidation,
                    maxLengthValidationPhone: Validator.organization.phone.maxLengthValidation,
                    maxLengthValidationAddress: Validator.organization.address.maxLengthValidation,
                    maxLengthValidationNotes: Validator.organization.notes.maxLengthValidation
                }
            })
                .data("kendoValidator");

            $('.chk-show-deleted', this.controls.grid.element).click(this.onShowDeleted.bind(this));

            $(document).on("click", ".k-overlay", this.onClosePopup.bind(this));

            this.controls.popup = popup.kendoWindow({
                title: i18n.Resources.Manage + " " + i18n.Resources.Admin,
                modal: true,
                pinned: true,
                visible: false,
                resizeable: false,
                draggable: false,
                actions: [
                    "Close"
                ]
            }).data("kendoWindow");

            this.controls.popupModel = kendo.observable({
                userID: null,
                organizationID: null,
                users: Datasources.usersDD,
                change: this.onChange.bind(this)
            });

            kendo.bind(popupModel, this.controls.popupModel);

            this.validators.popupModel = popupModel.kendoValidator().data("kendoValidator");
        }
    },

    ddEditor: function (container, options) {
        $('<input required data-text-field="name" data-value-field="id" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Organizations.getDatasourceDD(options.model.id)
            });
    },

    detailInit: function (e) {
        var datasourceItem = Licenses.getDatasource();

        var grid = $("<div/>")
            .appendTo(e.detailCell)
            .kendoGrid({
                dataSource: datasourceItem,
                sortable: false,
                editable: "popup",
                selectable: false,
                scrollable: false,
                resizable: true,
                autoBind: false,
                pageable: {
                    refresh: true,
                    pageSizes: [10, 50, 100]
                },
                toolbar: [
                    {
                        name: "create",
                        text: i18n.Resources.Add + ' ' + i18n.Resources.License,
                        className: "k-grid-add"
                    }
                ],
                columns: [
                    {
                        field: 'idView',
                        title: i18n.Resources.ID,
                        editor: KendoDS.emptyEditor
                    }, {
                        field: 'type',
                        title: i18n.Resources.Type,
                        template: function (ed) {
                            return Format.license.type(ed.type);
                        },
                        editor: Licenses.typeDDEditor
                    }, {
                        field: 'amount',
                        title: i18n.Resources.Amount
                    }, {
                        field: 'status',
                        title: i18n.Resources.Status,
                        template: function (ed) {
                            return Format.license.status(ed.status, ed.expirationAt);
                        },
                        editor: Licenses.statusDDEditor
                    }, {
                        field: 'expirationAt',
                        title: i18n.Resources.ExpirationAt,
                        editor: KendoDS.dateEditor,
                        format: "{0:yyyy-MM-dd}",
                        template: function (ed) {
                            return Format.license.expiredAt(ed.expirationAt);
                        }
                    }, {
                        field: 'used',
                        title: i18n.Resources.Used,
                        editor: KendoDS.emptyEditor,
                        template: function (ed) {
                            return Format.license.used(ed.used);
                        }
                    }, {
                        command: [
                            {
                                name: "edit",
                                text: i18n.Resources.Edit,
                                className: "k-grid-edit"
                            }, {
                                name: "delete",
                                text: i18n.Resources.Delete,
                                className: "k-grid-delete"
                            }
                        ],
                        title: i18n.Resources.Actions,
                        width: '165px'
                    }
                ],
                save: KendoDS.onSave,
                edit: function (ed) {
                    ed.model.set("organizationID", e.data.id);
                },
                dataBound: KendoDS.onDataBound
            })
            .data("kendoGrid");

        KendoDS.bind(grid, true);

        datasourceItem.filter({
            field: "OrganizationID",
            operator: "eq",
            value: parseInt(e.data.id)
        });
    },
    getEmptyModel: function () {
        return {
            name: null,
            phone: null,
            address: null,
            notes: null,
            user: {
                email: null,
                username: null,
                firstname: null,
                lastname: null
            }
        };
    },
    onDataBound: function (e) {
        KendoDS.onDataBound(e);

        $(".k-grid-delete", Organizations.controls.grid.element)
            .each(function () {
                var currentDataItem = Organizations.controls.grid.dataItem($(this).closest("tr"));

                if (currentDataItem.status === Enums.OrganizationStatusType.enum.Deleted) {
                    $(this).remove();
                }
            });

        $(".k-grid-edit", Organizations.controls.grid.element)
            .each(function () {
                var currentDataItem = Organizations.controls.grid.dataItem($(this).closest("tr"));

                if (currentDataItem.status === Enums.OrganizationStatusType.enum.Deleted) {
                    $(this).remove();
                }
            });

        $(".k-grid-restore", Organizations.controls.grid.element)
            .each(function () {
                var currentDataItem = Organizations.controls.grid.dataItem($(this).closest("tr"));

                if (currentDataItem.status === Enums.OrganizationStatusType.enum.Active) {
                    $(this).remove();
                }
            });

    },
    onShowDeleted: function (e) {
        this.isDeleted = $(e.currentTarget).prop('checked');
        this.onFilter();
    },
    onRestore: function (e) {
        var item = Organizations.controls.grid.dataItem($(e.currentTarget).closest("tr"));
        item.set('status', Enums.OrganizationStatusType.enum.Active);
        Organizations.controls.grid.dataSource.sync();
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
            this.controls.grid.dataSource.one('requestEnd',
                function (e) {
                    if (e.type === "create") {
                        if (!e.response.Errors) {
                            this.onReset();
                        }
                    }
                }.bind(this));
        }
    },
    onEnter: function (e) {
        if (e.keyCode === kendo.keys.ENTER) {
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
    },
    onAdmin: function (e) {
        e.preventDefault();
        var grid = Organizations.controls.grid;
        var item = grid.dataItem($(e.currentTarget).closest("tr"));

        this.controls.popupModel.set('userID', item.userID);
        this.controls.popupModel.set('organizationID', item.id);

        Datasources.usersDD.filter({
            field: 'Used',
            operator: 'eq',
            value: item.id
        });

        this.onShowPopup();
    },
    onShowPopup: function (e) {
        this.controls.popup.open().center();
    },
    onClosePopup: function (e) {
        this.controls.popup.close();
    },
    onChange: function (e) {
        e.preventDefault();

        var userID = Organizations.controls.popupModel.get("userID");
        var organizationID = Organizations.controls.popupModel.get("organizationID");

        Organizations.onClosePopup();

        Ajax.post("/admin/api/organizations/change",
        {
            organizationID: organizationID,
            userID: userID
        }).success(this.onChangeSuccess);
    },
    onChangeSuccess: function(e) {
        if (e) {
            Datasources.organizations.read();
        } else {
            Notifications.error(e);
        }
    },
    onResetPopup: function (e) {
        this.controls.popupModel.set('userID', null);
        this.controls.popupModel.set('organizationID', null);

        Datasources.usersDD.filter({
            field: 'Used',
            operator: 'eq',
            value: -1
        });
    }

};

Datasources.bind(Organizations.datasources);