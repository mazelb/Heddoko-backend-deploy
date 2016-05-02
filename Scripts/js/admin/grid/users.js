$(function () {
});

var Users = {
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
            }
        });
    },
    ddEditor: function (container, options) {
        $('<input required data-text-field="name" data-value-field="id"  data-value-primitive="true" data-bind="value:' + options.field + '"/>')
        .appendTo(container)
        .kendoDropDownList({
            autoBind: true,
            dataSource: Datasources.usersDD
        });
    },
};

Datasources.bind(Users.datasources);