$(function () {
    Assemblies.init();
});

var Assemblies = {
    controls: {
        form: null,
        grid: null,
        filterModel: null,
        addModel: null
    },

    datasources: function () {
        this.assemblies = Assemblies.getDatasource();
    },

    getDatasource: function () {

    },

    init: function () {
        var control = $("#assembliesGrid");

        if (control.length > 0) {
            this.controls.grid = control.kendoGrid({
                dataSource: Datasource.assemblies,

            })
        }
    }
};
