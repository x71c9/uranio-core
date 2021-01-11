"use strict";
/**
 * Module for Atom Validation
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports._validate_encrypt_property = exports.validate_property = exports.validate_atom_partial = exports.validate_atom_shape = exports.validate_atom = exports.validate_molecule_primitive_properties = exports.validate = exports.is_optional_property = exports.is_valid_property = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init(`VALIDATION`, `Validate module`);
const types_1 = require("../types");
const book_1 = require("../book");
const defaults_1 = require("../conf/defaults");
const util_1 = require("./util");
const keys_1 = require("./keys");
function is_valid_property(atom_name, key) {
    if (urn_lib_1.urn_util.object.has_key(types_1.atom_hard_properties, key)) {
        return true;
    }
    if (urn_lib_1.urn_util.object.has_key(types_1.atom_common_properties, key)) {
        return true;
    }
    if (urn_lib_1.urn_util.object.has_key(book_1.atom_book[atom_name]['properties'], key)) {
        return true;
    }
    return false;
}
exports.is_valid_property = is_valid_property;
function is_optional_property(atom_name, key) {
    const atom_props = book_1.atom_book[atom_name]['properties'];
    let prop_def = undefined;
    if (urn_lib_1.urn_util.object.has_key(types_1.atom_hard_properties, key)) {
        prop_def = types_1.atom_hard_properties[key];
    }
    else if (urn_lib_1.urn_util.object.has_key(types_1.atom_common_properties, key)) {
        prop_def = types_1.atom_common_properties[key];
    }
    else if (urn_lib_1.urn_util.object.has_key(atom_props, key)) {
        prop_def = atom_props[key];
    }
    if (!prop_def) {
        const err_msg = `Atom property definition missing for atom [${atom_name}] property [${key}]`;
        throw urn_exc.create('IS_OPTIONAL_MISSING_ATM_PROP_DEFINITION', err_msg);
    }
    return (prop_def &&
        urn_lib_1.urn_util.object.has_key(prop_def, 'optional') &&
        prop_def.optional === true);
}
exports.is_optional_property = is_optional_property;
function validate(atom_name, molecule, depth) {
    if (!depth) {
        validate_atom(atom_name, molecule);
    }
    else {
        validate_molecule_primitive_properties(atom_name, molecule);
        _validate_molecule_bond_properties(atom_name, molecule, depth);
    }
    return molecule;
}
exports.validate = validate;
function validate_molecule_primitive_properties(atom_name, molecule) {
    _validate_hard_properties(molecule);
    _has_all_properties(atom_name, molecule);
    _has_no_other_properties(atom_name, molecule);
    _validate_primitive_properties(atom_name, molecule);
    return true;
}
exports.validate_molecule_primitive_properties = validate_molecule_primitive_properties;
function validate_atom(atom_name, atom) {
    _validate_hard_properties(atom);
    validate_atom_shape(atom_name, atom);
    return atom;
}
exports.validate_atom = validate_atom;
function validate_atom_shape(atom_name, atom_shape) {
    _has_all_properties(atom_name, atom_shape);
    validate_atom_partial(atom_name, atom_shape);
    return true;
}
exports.validate_atom_shape = validate_atom_shape;
function validate_atom_partial(atom_name, partial_atom) {
    _has_no_other_properties(atom_name, partial_atom);
    _validate_primitive_properties(atom_name, partial_atom);
    _validate_partial_atom_bond_properties(atom_name, partial_atom);
    return true;
}
exports.validate_atom_partial = validate_atom_partial;
function validate_property(prop_key, prop_def, prop_value, atom) {
    try {
        _validate_primitive_type(prop_key, prop_def, prop_value);
        _validate_custom_type(prop_key, prop_def, prop_value);
    }
    catch (exc) {
        if (exc.type === "INVALID" /* INVALID */) {
            throw urn_exc.create_invalid(exc.err_msg, exc.msg, atom, [prop_key]);
        }
        throw exc;
    }
    return true;
}
exports.validate_property = validate_property;
function _validate_encrypt_property(prop_key, prop_def, prop_value) {
    if (prop_def && prop_def.validation && prop_def.validation.max &&
        prop_def.validation.max > defaults_1.core_config.max_password_length) {
        prop_def.validation.max = defaults_1.core_config.max_password_length;
    }
    _custom_validate_string(prop_key, prop_def, prop_value);
    return true;
}
exports._validate_encrypt_property = _validate_encrypt_property;
function _has_all_properties(atom_name, atom_shape) {
    const atom_props = book_1.atom_book[atom_name]['properties'];
    const missin_props = [];
    for (const [k] of Object.entries(atom_props)) {
        if (!is_optional_property(atom_name, k) && !urn_lib_1.urn_util.object.has_key(atom_shape, k)) {
            missin_props.push(k);
        }
    }
    for (const [k] of Object.entries(types_1.atom_common_properties)) {
        if (!is_optional_property(atom_name, k) && !urn_lib_1.urn_util.object.has_key(atom_shape, k)) {
            missin_props.push(k);
        }
    }
    if (missin_props.length > 0) {
        let err_msg = `Atom is missing the following properties:`;
        err_msg += ` [${missin_props.join(', ')}]`;
        throw urn_exc.create_invalid('MISSING_PROP', err_msg, atom_shape, missin_props);
    }
    return true;
}
function _has_no_other_properties(atom_name, partial_atom) {
    const atom_props = book_1.atom_book[atom_name]['properties'];
    const extra_props = [];
    for (const k in partial_atom) {
        if (urn_lib_1.urn_util.object.has_key(types_1.atom_hard_properties, k)) {
            continue;
        }
        if (urn_lib_1.urn_util.object.has_key(types_1.atom_common_properties, k)) {
            continue;
        }
        if (!urn_lib_1.urn_util.object.has_key(atom_props, k)) {
            extra_props.push(k);
        }
    }
    if (extra_props.length > 0) {
        let err_msg = `Atom has invalid properties:`;
        err_msg += ` [${extra_props.join(', ')}]`;
        throw urn_exc.create_invalid('INVALID_EXTRA_PROP', err_msg, partial_atom, extra_props);
    }
    return true;
}
function _validate_hard_properties(atom) {
    let k;
    for (k in types_1.atom_hard_properties) {
        try {
            _validate_primitive_type(k, types_1.atom_hard_properties[k], atom[k]);
            _validate_custom_type(k, types_1.atom_hard_properties[k], atom[k]);
        }
        catch (exc) {
            if (exc.type === "INVALID" /* INVALID */) {
                throw urn_exc.create_invalid(exc.error_code, exc.msg, atom, [k]);
            }
            throw exc;
        }
    }
    return true;
}
function _validate_primitive_properties(atom_name, partial_atom) {
    const props = book_1.atom_book[atom_name]['properties'];
    let k;
    for (k in partial_atom) {
        let prop_def = undefined;
        if (urn_lib_1.urn_util.object.has_key(types_1.atom_hard_properties, k)) {
            prop_def = types_1.atom_hard_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(types_1.atom_common_properties, k)) {
            prop_def = types_1.atom_common_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(props, k)) {
            prop_def = props[k];
        }
        if (!prop_def) {
            const err_msg = `Atom property definition missing for atom [${atom_name}] property [${k}]`;
            throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
        }
        if (prop_def.type === "ATOM" /* ATOM */ || prop_def.type === "ATOM_ARRAY" /* ATOM_ARRAY */) {
            continue;
        }
        try {
            _validate_primitive_type(k, prop_def, partial_atom[k]);
            _validate_custom_type(k, prop_def, partial_atom[k]);
        }
        catch (exc) {
            if (exc.type === "INVALID" /* INVALID */) {
                throw urn_exc.create_invalid(exc.error_code, exc.msg, partial_atom, [k]);
            }
            throw exc;
        }
    }
    return true;
}
function _validate_partial_atom_bond_properties(atom_name, partial_atom) {
    const props = book_1.atom_book[atom_name]['properties'];
    let k;
    for (k in partial_atom) {
        let prop_def = undefined;
        if (urn_lib_1.urn_util.object.has_key(types_1.atom_hard_properties, k)) {
            prop_def = types_1.atom_hard_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(types_1.atom_common_properties, k)) {
            prop_def = types_1.atom_common_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(props, k)) {
            prop_def = props[k];
        }
        if (!prop_def) {
            const err_msg = `Atom property definition missing for atom [${atom_name}] property [${k}]`;
            throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
        }
        if (prop_def.type !== "ATOM" /* ATOM */ && prop_def.type !== "ATOM_ARRAY" /* ATOM_ARRAY */) {
            continue;
        }
        try {
            _validate_primitive_type(k, prop_def, partial_atom[k]);
        }
        catch (exc) {
            if (exc.type === "INVALID" /* INVALID */) {
                throw urn_exc.create_invalid(exc.error_code, exc.msg, partial_atom, [k]);
            }
            throw exc;
        }
    }
    return true;
}
function _validate_molecule_bond_properties(atom_name, molecule, depth) {
    console.log(molecule);
    const props = book_1.atom_book[atom_name]['properties'];
    const bond_keys = keys_1.get_bond_keys(atom_name);
    for (const k of bond_keys) {
        let prop_def = undefined;
        if (urn_lib_1.urn_util.object.has_key(types_1.atom_hard_properties, k)) {
            prop_def = types_1.atom_hard_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(types_1.atom_common_properties, k)) {
            prop_def = types_1.atom_common_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(props, k)) {
            prop_def = props[k];
        }
        if (!prop_def) {
            const err_msg = `Atom property definition missing for atom [${atom_name}] property [${k}]`;
            throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
        }
        const subatom_name = util_1.get_subatom_name(atom_name, k);
        const number_depth = (!depth) ? 0 : depth - 1;
        try {
            const prop_value = molecule[k];
            if (!depth) {
                validate_property(k, prop_def, prop_value, molecule);
            }
            else {
                _validate_bond_type(k, prop_def, prop_value);
                _validate_custom_bond_type(k, prop_def, prop_value);
                if (Array.isArray(prop_value)) {
                    for (const subatom of prop_value) {
                        validate(subatom_name, subatom, number_depth);
                    }
                }
                else {
                    validate(subatom_name, prop_value, number_depth);
                }
            }
        }
        catch (exc) {
            if (exc.type === "INVALID" /* INVALID */) {
                throw urn_exc.create_invalid(exc.error_code, exc.msg, molecule, [k]);
            }
            throw exc;
        }
    }
    return true;
}
function _validate_primitive_type(prop_key, prop_def, prop_value) {
    if (urn_lib_1.urn_util.object.has_key(prop_def, 'optional') &&
        prop_def.optional === true &&
        typeof prop_value === 'undefined') {
        return true;
    }
    switch (prop_def.type) {
        case "ID" /* ID */:
        case "TEXT" /* TEXT */:
        case "LONG_TEXT" /* LONG_TEXT */:
        case "ENCRYPTED" /* ENCRYPTED */:
        case "EMAIL" /* EMAIL */: {
            if (typeof prop_value !== 'string') {
                let err_msg = `Invalid property [${prop_key}]. Property should be a string.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            return true;
        }
        case "INTEGER" /* INTEGER */:
        case "FLOAT" /* FLOAT */: {
            if (typeof prop_value !== 'number') {
                let err_msg = `Invalid property [${prop_key}]. Property should be a number.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            return true;
        }
        case "BINARY" /* BINARY */: {
            if (typeof prop_value !== 'boolean') {
                let err_msg = `Invalid property [${prop_key}]. Property should be a boolean.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            return true;
        }
        case "TIME" /* TIME */: {
            if (!urn_lib_1.urn_util.is.date(prop_value)) {
                let err_msg = `Invalid property [${prop_key}]. Property should be a Date.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            return true;
        }
        case "SET_STRING" /* SET_STRING */: {
            if (!Array.isArray(prop_value)) {
                let err_msg = `Invalid property [${prop_key}]. Property should be a string array.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            return true;
        }
        case "SET_NUMBER" /* SET_NUMBER */: {
            if (!Array.isArray(prop_value)) {
                let err_msg = `Invalid property [${prop_key}]. Property should be a number array.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            return true;
        }
        case "ENUM_STRING" /* ENUM_STRING */: {
            if (typeof prop_value !== 'string') {
                let err_msg = `Invalid property [${prop_key}]. Property should be a string.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            if (!prop_def.values.includes(prop_value)) {
                let err_msg = `Invalid property [${prop_key}]. Property should be one of following:`;
                err_msg += ` ['${prop_def.values.join("','")}']`;
                throw urn_exc.create_invalid('INVALID_ENUM_PROP', err_msg);
            }
            return true;
        }
        case "ENUM_NUMBER" /* ENUM_NUMBER */: {
            if (typeof prop_value !== 'number') {
                let err_msg = `Invalid property [${prop_key}]. Property should be a number.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            if (!prop_def.values.includes(prop_value)) {
                let err_msg = `Invalid property [${prop_key}]. Property should be one of the following:`;
                err_msg += ` [${prop_def.values.join(', ')}]`;
                throw urn_exc.create_invalid('INVALID_ENUM_PROP', err_msg);
            }
            return true;
        }
        case "ATOM" /* ATOM */: {
            if (typeof prop_value !== 'string') {
                let err_msg = `Invalid property [${prop_key}]. Property should be a string.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            return true;
        }
        case "ATOM_ARRAY" /* ATOM_ARRAY */: {
            if (!Array.isArray(prop_value)) {
                let err_msg = `Invalid property [${prop_key}]. Property should be an Array.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            else if (!prop_value.every((id) => typeof id === 'string')) {
                const err_msg = `Invalid property [${prop_key}]. Property should be an Array of string.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            return true;
        }
    }
    // const err_msg = `Invalid Atom type definition.`;
    // throw urn_exc.create('CHECK_PROP_MAIN_TYPE_INVALID_ATM_TYPE',err_msg);
}
function _validate_custom_type(prop_key, prop_def, prop_value, partial_atom) {
    try {
        switch (prop_def.type) {
            case "TEXT" /* TEXT */:
            case "LONG_TEXT" /* LONG_TEXT */: {
                _custom_validate_string(prop_key, prop_def, prop_value);
                break;
            }
            case "INTEGER" /* INTEGER */:
            case "FLOAT" /* FLOAT */: {
                _custom_validate_number(prop_key, prop_def, prop_value);
                break;
            }
            case "TIME" /* TIME */: {
                _custom_validate_time(prop_key, prop_def, prop_value);
                break;
            }
            case "SET_STRING" /* SET_STRING */: {
                _custom_validate_set_string(prop_key, prop_def, prop_value);
                break;
            }
            case "SET_NUMBER" /* SET_NUMBER */: {
                _custom_validate_set_number(prop_key, prop_def, prop_value);
                break;
            }
        }
    }
    catch (exc) {
        if (exc.type === "INVALID" /* INVALID */) {
            throw urn_exc.create_invalid(exc.error_code, exc.msg, partial_atom, [prop_key]);
        }
        throw exc;
    }
}
function _validate_bond_type(prop_key, prop_def, prop_value) {
    if (urn_lib_1.urn_util.object.has_key(prop_def, 'optional') &&
        prop_def.optional === true &&
        typeof prop_value === 'undefined') {
        return true;
    }
    switch (prop_def.type) {
        case "ATOM" /* ATOM */: {
            if (typeof prop_value === null || typeof prop_value !== 'object') {
                let err_msg = `Invalid property [${prop_key}]. Property should be an object.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            return true;
        }
        case "ATOM_ARRAY" /* ATOM_ARRAY */: {
            if (!Array.isArray(prop_value)) {
                let err_msg = `Invalid property [${prop_key}]. Property should be an Array.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            else if (!prop_value.every((atom) => typeof atom !== null && typeof atom === 'object')) {
                const err_msg = `Invalid property [${prop_key}]. Property should be an Array of object.`;
                throw urn_exc.create_invalid('INVALID_PROP', err_msg);
            }
            return true;
        }
    }
    const err_msg = `Invalid Atom type definition.`;
    throw urn_exc.create('CHECK_PROP_MAIN_TYPE_INVALID_ATM_TYPE', err_msg);
}
function _validate_custom_bond_type(prop_key, prop_def, prop_value, partial_atom) {
    try {
        switch (prop_def.type) {
            case "ATOM" /* ATOM */: {
                _custom_validate_bond_atom(prop_key, prop_def, prop_value);
                break;
            }
            case "ATOM_ARRAY" /* ATOM_ARRAY */: {
                for (const subatom of prop_value) {
                    _custom_validate_bond_atom(prop_key, prop_def, subatom);
                }
                break;
            }
        }
    }
    catch (exc) {
        if (exc.type === "INVALID" /* INVALID */) {
            throw urn_exc.create_invalid(exc.error_code, exc.msg, partial_atom, [prop_key]);
        }
        throw exc;
    }
}
function _custom_validate_bond_atom(prop_key, prop_def, prop_value) {
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.date_from) {
            if (prop_value._date < vali.date_from) {
                const err_msg = `Invalid [${prop_key}]. Creation _date must be after ${vali.date_from}.`;
                throw urn_exc.create_invalid('DATE_LOWER_THAN_MIN', err_msg);
            }
        }
        if (vali.date_until) {
            if (prop_value._date > vali.date_until) {
                const err_msg = `Invalid [${prop_key}]. Creation _date must be before ${vali.date_until}.`;
                throw urn_exc.create_invalid('DATE_LOWER_THAN_MIN', err_msg);
            }
        }
    }
    return true;
}
function _custom_validate_string(prop_key, prop_def, prop_value) {
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.alphanum && vali.alphanum === true) {
            if (!/[0-9a-zA-Z]/.test(prop_value)) {
                const err_msg = `Invalid [${prop_key}]. Must be alphanumeric /[0-9a-zA-Z]/.`;
                throw urn_exc.create_invalid('STRING_INVALID_ALPHANUM', err_msg);
            }
        }
        if (vali.contain_digit && vali.contain_digit === true) {
            if (!/\d/.test(prop_value)) {
                const err_msg = `Invalid [${prop_key}]. Must be contain a digit.`;
                throw urn_exc.create_invalid('STRING_NOT_CONTAIN_DIGIT', err_msg);
            }
        }
        if (vali.contain_lowercase && vali.contain_lowercase === true) {
            if (prop_value.toUpperCase() === prop_value) {
                const err_msg = `Invalid [${prop_key}]. Must be contain a lowercase character.`;
                throw urn_exc.create_invalid('STRING_NOT_CONTAIN_LOWERCASE', err_msg);
            }
        }
        if (vali.contain_uppercase && vali.contain_uppercase === true) {
            if (prop_value.toLowerCase() === prop_value) {
                const err_msg = `Invalid [${prop_key}]. Must be contain an uppercase character.`;
                throw urn_exc.create_invalid('STRING_NOT_CONTAIN_UPPERCASE', err_msg);
            }
        }
        if (vali.length) {
            if (vali.length !== prop_value.length) {
                let err_msg = `Invalid [${prop_key}]. String length must be equal to ${vali.length}.`;
                err_msg += ` Length given ${prop_value.length}`;
                throw urn_exc.create_invalid('STRING_INVALI_LENGTH', err_msg);
            }
        }
        if (vali.lowercase && vali.lowercase === true) {
            if (prop_value.toLowerCase() !== prop_value) {
                const err_msg = `Invalid [${prop_key}]. Must be lowercase.`;
                throw urn_exc.create_invalid('STRING_NOT_LOWERCASE', err_msg);
            }
        }
        if (vali.max) {
            if (prop_value.length > vali.max) {
                const err_msg = `Invalid [${prop_key}]. Length must be maximum ${vali.max} characters long.`;
                throw urn_exc.create_invalid('STRING_MAX_LENGTH', err_msg);
            }
        }
        if (vali.min) {
            if (prop_value.length < vali.min) {
                const err_msg = `Invalid [${prop_key}]. Length must be minimum ${vali.min} characters long.`;
                throw urn_exc.create_invalid('STRING_MIN_LENGTH', err_msg);
            }
        }
        if (vali.only_letters && vali.only_letters === true) {
            if (!/^[A-Za-z]+$/.test(prop_value)) {
                const err_msg = `Invalid [${prop_key}]. Must be contain only letters.`;
                throw urn_exc.create_invalid('STRING_NOT_ONLY_LETTERS', err_msg);
            }
        }
        if (vali.only_numbers) {
            if (!/^[0-9]+$/.test(prop_value)) {
                const err_msg = `Invalid [${prop_key}]. Must be contain only numbers.`;
                throw urn_exc.create_invalid('STRING_NOT_ONLY_NUMBERS', err_msg);
            }
        }
        if (vali.reg_ex) {
            if (!vali.reg_ex.test(prop_value)) {
                const err_msg = `Invalid [${prop_key}]. Does not satisfy regular expression ${vali.reg_ex}.`;
                throw urn_exc.create_invalid('STRING_INVALID_REG_EX', err_msg);
            }
        }
        if (vali.uppercase && vali.uppercase === true) {
            if (prop_value.toUpperCase() !== prop_value) {
                const err_msg = `Invalid [${prop_key}]. Must be uppercase.`;
                throw urn_exc.create_invalid('STRING_NOT_UPPERCASE', err_msg);
            }
        }
    }
    return true;
}
function _custom_validate_number(prop_key, prop_def, prop_value) {
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.eq) {
            if (prop_value != vali.eq) {
                const err_msg = `Invalid [${prop_key}]. Must be equal to ${vali.eq}.`;
                throw urn_exc.create_invalid('NUMBER_NOTEQ_TO', err_msg);
            }
        }
        if (vali.min) {
            if (prop_value < vali.min) {
                const err_msg = `Invalid [${prop_key}]. Must be grater than ${vali.min}.`;
                throw urn_exc.create_invalid('NUMBER_LOWER_THAN_MIN', err_msg);
            }
        }
        if (vali.max) {
            if (prop_value > vali.max) {
                const err_msg = `Invalid [${prop_key}]. Must be lower than ${vali.max}.`;
                throw urn_exc.create_invalid('NUMBER_GRATER_THAN_MAX', err_msg);
            }
        }
    }
    return true;
}
function _custom_validate_time(prop_key, prop_def, prop_value) {
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.eq) {
            if (prop_value != vali.eq) {
                const err_msg = `Invalid [${prop_key}]. Must be equal to ${vali.eq}.`;
                throw urn_exc.create_invalid('DATE_NOT_EQ_TO', err_msg);
            }
        }
        if (vali.min) {
            if (prop_value < vali.min) {
                const err_msg = `Invalid [${prop_key}]. Must be grater than ${vali.min}.`;
                throw urn_exc.create_invalid('DATE_LOWER_THAN_MIN', err_msg);
            }
        }
        if (vali.max) {
            if (prop_value > vali.max) {
                const err_msg = `Invalid [${prop_key}]. Must be lower than ${vali.max}.`;
                throw urn_exc.create_invalid('DATE_GRATER_THAN_MAX', err_msg);
            }
        }
    }
    return true;
}
function _custom_validate_set_string(prop_key, prop_def, prop_value) {
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.length) {
            if (prop_value.length != vali.length) {
                const err_msg = `Invalid [${prop_key}]. Array length must be equal to ${vali.length}.`;
                throw urn_exc.create_invalid('SET_LENGTH_NOT_EQ_TO', err_msg);
            }
        }
        if (vali.min) {
            if (prop_value.length < vali.min) {
                const err_msg = `Invalid [${prop_key}]. Array length must be greater than ${vali.min}.`;
                throw urn_exc.create_invalid('SET_LENGTH_LOWER_THAN', err_msg);
            }
        }
        if (vali.max) {
            if (prop_value.length > vali.max) {
                const err_msg = `Invalid [${prop_key}]. Array length must be lower than ${vali.max}.`;
                throw urn_exc.create_invalid('SET_LENGTH_GRATER_THAN', err_msg);
            }
        }
        if (vali.values) {
            for (const v of prop_value) {
                if (!vali.values.includes(v)) {
                    let err_msg = `Invalid [${prop_key}]. Invalid element. Element must be one of the following:`;
                    err_msg += ` ['${vali.values.join("', '")}']`;
                    throw urn_exc.create_invalid('SET_LENGTH_GRATER_THAN', err_msg);
                }
            }
        }
    }
    return true;
}
function _custom_validate_set_number(prop_key, prop_def, prop_value) {
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.length) {
            if (prop_value.length != vali.length) {
                const err_msg = `Invalid [${prop_key}]. Array length must be equal to ${vali.length}.`;
                throw urn_exc.create_invalid('SET_LENGTH_NOT_EQ_TO', err_msg);
            }
        }
        if (vali.min) {
            if (prop_value.length < vali.min) {
                const err_msg = `Invalid [${prop_key}]. Array length must be greater than ${vali.min}.`;
                throw urn_exc.create_invalid('SET_LENGTH_LOWER_THAN', err_msg);
            }
        }
        if (vali.max) {
            if (prop_value.length > vali.max) {
                const err_msg = `Invalid [${prop_key}]. Array length must be lower than ${vali.max}.`;
                throw urn_exc.create_invalid('SET_LENGTH_GRATER_THAN', err_msg);
            }
        }
        if (vali.values) {
            for (const v of prop_value) {
                if (!vali.values.includes(v)) {
                    let err_msg = `Invalid [${prop_key}]. Invalid element. Element must be one of the following:`;
                    err_msg += ` [${vali.values.join(', ')}]`;
                    throw urn_exc.create_invalid('SET_LENGTH_GRATER_THAN', err_msg);
                }
            }
        }
    }
    return true;
}
//# sourceMappingURL=validate.js.map