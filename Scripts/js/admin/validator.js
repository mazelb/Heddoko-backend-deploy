var Validator = {
    materialType: {
        maxSize: 50,
        maxLengthValidation: function (input) {
            return Validator.maxLengthValidation(input, 'identifier', Validator.materialType.maxSize);
        }
    },
    material: {
        name: {
            maxSize: 255,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'name', Validator.material.name.maxSize);
            }
        },
        partNo: {
            maxSize: 255,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'partNo', Validator.material.partNo.maxSize);
            }
        }
    },
    equipment: {
        notes: {
            maxSize: 1024,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'notes', Validator.equipment.notes.maxSize);
            }
        },
        physicalLocation: {
            maxSize: 255,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'physicalLocation', Validator.equipment.physicalLocation.maxSize);
            }
        },
        macAddress: {
            maxSize: 255,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'macAddress', Validator.equipment.macAddress.maxSize);
            }
        },
        serialNo: {
            maxSize: 255,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'serialNo', Validator.equipment.serialNo.maxSize);
            }
        }
    },
    maxLengthValidation: function (input, name, maxLength) {
        if (!input.is('[name="' + name + '"]')) {
            return true;
        }

        input.attr("data-maxLengthValidation-msg", i18n.Resources.ValidateMaxLengthMessage.replace('{2}', maxLength));

        return input.val().length <= maxLength;
    }
};