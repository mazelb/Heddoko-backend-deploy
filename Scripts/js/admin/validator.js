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
    organization: {
        notes: {
            maxSize: 1024,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'notes', Validator.organization.notes.maxSize);
            }
        },
        address: {
            maxSize: 255,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'address', Validator.organization.address.maxSize);
            }
        },
        phone: {
            maxSize: 255,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'phone', Validator.organization.phone.maxSize);
            }
        },
        email: {
            maxSize: 255,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'email', Validator.organization.email.maxSize);
            }
        },
        name: {
            maxSize: 255,
            maxLengthValidation: function (input) {
                return Validator.maxLengthValidation(input, 'name', Validator.organization.name.maxSize);
            }
        }
    },
    license: {
        expirationAt: {
            expirationAtValidation: function (input) {
                if (!input.is('[name="expirationAt"]')) {
                    return true;
                }

                input.attr("data-expirationAtValidation-msg", i18n.Resources.WrongExpirationAtDate);

                var val = input.val();
                var result = KendoDS.validateDate(val)
                if (result) {
                    return result >= kendo.date.today();
                } 

                return false;
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