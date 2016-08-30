var Equipments = {
    datasources: function() {
        //Datasources context

        this.equipmentQAStatusTypes = new kendo.data.DataSource({
            data: _.values(Enums.EquipmentQAStatusType.array)
        });

        this.equipmentQAStatusTypes.read();

        this.equipmentStatusTypes = new kendo.data.DataSource({
            data: _.values(Enums.EquipmentStatusType.array)
        });

        this.equipmentStatusTypes.read();

        this.sizeTypes = new kendo.data.DataSource({
            data: _.values(Enums.SizeType.array)
        });

        this.sizeTypes.read();

        this.anatomicalLocationTypes = new kendo.data.DataSource({
            data: _.values(Enums.AnatomicalLocationType.array)
        });

        this.anatomicalLocationTypes.read();
    },

    sizeDDEditor: function(container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.sizeTypes
            });
    },

    equipmentStatusDDEditor: function(container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.equipmentStatusTypes
            });
    },

    equipmentQAStatusDDEditor: function(container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.equipmentQAStatusTypes
            });
    },

    anatomicalLocationDDEditor: function(container, options) {
        $('<input required data-text-field="text" data-value-field="value" data-value-primitive="true" data-bind="value: ' + options.field + '"/>')
            .appendTo(container)
            .kendoDropDownList({
                autoBind: true,
                dataSource: Datasources.anatomicalLocationTypes
            });
    }
};

Datasources.bind(Equipments.datasources);