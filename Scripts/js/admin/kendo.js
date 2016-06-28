var Dispatcher = $(document);

$(function () {
    Datasources.init();
});

var Datasources = {
    init: function () {
        Dispatcher.trigger('datasource:init');
    },
    bind: function (datasources) {
        datasources.call(Datasources);
    }
};

var KendoDS = {
    template: {
    },
    pageSize: 10,
    maxInt: 1000000,
    init: function () {
    },
    validateExtension: function (e) {
        $.each(e.files, function () {
            if (this.extension.toLowerCase() != ".jpg") {
                alert(i18n.Resources.JpgValidation)
                e.preventDefault();
            }
        });
    },
    buildTransport: function (url, isNotAsync, type) {
        type = type || "GET";
        var isBulk = type == 'GET';
        var getUrl = isBulk ? url : url + '/bulk';
        var transport = {
            read: {
                url: getUrl,
                type: type,
                timeout: 600000,
                dataType: "json",
                contentType: "application/json"
            },
            update: {
                url: function (data) {
                    if (data.models) {
                        return url + 'batch';
                    } else {
                        return url + '/' + data.id;
                    }
                },
                type: "PUT",
                dataType: "json",
                contentType: "application/json"
            },
            destroy: {
                url: function (data) {
                    if (data.models) {
                        return url + 'batch';
                    } else {
                        return url + '/' + data.id;
                    }
                },
                type: "DELETE",
                dataType: "json",
                contentType: "application/json"
            },
            create: {
                async: isNotAsync ? false : true,
                url: url,
                type: "POST",
                timeout: 600000,
                dataType: "json",
                contentType: "application/json"
            },
            parameterMap: function (options, type) {
                switch (type) {
                    case 'read':
                        return isBulk ? options : kendo.stringify(options);
                    case 'destroy':
                        return options;
                    case 'create':
                    case 'update':
                        if (options.models) {
                            return kendo.stringify(options.models);
                        }
                        return kendo.stringify(options);
                }
            }
        };

        return transport;
    },
    updateItem: function (item, object) {
        for (var i in object) {
            if (object.hasOwnProperty(i)
             && item.hasOwnProperty(i)) {
                item.set(i, object[i]);
            }
        }
    },
    parseErrors: function (e, grid) {
        var parsedErrors = [];
        for (var i = 0; i < e.length; i++) {
            parsedErrors.push(KendoDS.parseError(e[i], grid));
        }
        return parsedErrors;
    },
    parseError: function (e, grid) {
        if (null === e.Code
            || 0 !== e.Code.indexOf('model.')
        ) {
            return e;
        }

        var fieldName = e.Code.replace('model.', '');
        if (grid) {
            for (var i = 0; i < grid.options.columns.length; i++) {
                if (grid.options.columns[i].field.toLowerCase() === fieldName.toLowerCase()) {
                    e.Key = grid.options.columns[i].title;
                    break;
                }
            }
        }

        return e;
    },
    processModel: function (dataSource, httpMethod, modelId, grid, isCancel) {
        switch (httpMethod) {
            case 'GET':
                break;
            case 'POST':
                if (grid) {
                    var dataItem;
                    for (var i = 0; i < dataSource.data().length; i++) {
                        if (dataSource.data()[i].id === null) {
                            dataItem = dataSource.data()[i];
                        }
                    }

                    if (isCancel) {
                        dataSource.cancelChanges();
                    }
                }
                break;
            case 'PUT':
                if (grid) {
                    var dataItem = dataSource.get(modelId);

                    if (typeof callback == 'function') {
                        callback(dataItem);
                    }
                }

                break;
            case 'DELETE':
                dataSource.cancelChanges();
                break;
        }
    },
    onSave: function (e) {
        Notifications.clear();
    },
    bind: function (grid, isCancel) {
        grid.dataSource.bind("error", function (e) {
            KendoDS.onError(e, grid, isCancel);
            e.preventDefault();
            return false;
        });
    },
    onError: function (e, grid, isCancel) {
        if (!e.errors) {
            return;
        }

        var errors = e.errors.Errors;
        var httpMethod = e.errors.Method;
        var modelId = e.errors.ID;

        if (grid) {
            grid.one('dataBinding', function (e) {
                e.preventDefault();
            });
        }

        KendoDS.processModel(grid.dataSource, httpMethod, modelId, grid, isCancel);

        if (errors) {
            var parsedErrors = KendoDS.parseErrors(errors, grid);
            for (var i = 0; i < parsedErrors.length; i++) {
                Notifications.add(parsedErrors[i]);
            }
        }
    },
    validateDate: function (date) {
        var result = kendo.parseDate(date, 'd-MMMM-yyyy');
        if (result) {
            return result;
        }
        result = kendo.parseDate(date, 'dd.MM.yyyy');
        if (result) {
            return result;
        }
        return false;
    },
    emptyEditor: function (container, options) {
        container.prev().hide();
        container.hide();
    },
    textAreaDDEditor: function (container, options) {
        $('<textarea data-bind="value: ' + options.field + '"></textarea>').appendTo(container);
    },
    dateEditor: function (container, options) {
        $('<input data-text-field="' + options.field + '" data-value-field="' + options.field + '" data-bind="value:' + options.field + '" data-format="' + options.format + '"/>')
            .appendTo(container)
            .kendoDatePicker({
                autoBind: true
            });
    },
    onDataBound: function (e) {
        var grid = e.sender;
        if (grid.dataSource.total() == 0) {
            var colCount = grid.columns.length;
            $(grid.wrapper).find('tbody').append('<tr class="kendo-data-row"><td colspan="' + colCount + '" class="no-data">' + i18n.Resources.EmptyItems + '</td></tr>');
        }

        if (grid.dataSource.totalPages() <= 1
         || isNaN(grid.dataSource.totalPages())) {
            grid.pager.element.hide();
        }
        else {
            grid.pager.element.show();
        }
    }
};