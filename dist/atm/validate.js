"use strict";
/**
 * Module for schema.Atom Validation
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt_property = exports.property = exports.atom_partial = exports.atom_shape = exports.atom = exports.molecule_primitive_properties = exports.any = exports.molecule = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init(`VALIDATION`, `Validate module`);
const types_1 = require("../cln/types");
const client_1 = require("../stc/client");
// This will import server on client
// import * as conf from '../conf/index';
const atm_util = __importStar(require("./util"));
const atm_keys = __importStar(require("./keys"));
const book = __importStar(require("../book/client"));
function molecule(atom_name, molecule, depth) {
    return any(atom_name, molecule, depth);
}
exports.molecule = molecule;
function any(atom_name, molecule, depth) {
    if (!depth) {
        atom(atom_name, molecule);
    }
    else {
        molecule_primitive_properties(atom_name, molecule);
        _validate_molecule_bond_properties(atom_name, molecule, depth);
    }
    return molecule;
}
exports.any = any;
function molecule_primitive_properties(atom_name, molecule) {
    _validate_hard_properties(molecule);
    _has_all_properties(atom_name, molecule);
    _has_no_other_properties(atom_name, molecule);
    _validate_primitive_properties(atom_name, molecule);
    return true;
}
exports.molecule_primitive_properties = molecule_primitive_properties;
function atom(atom_name, atom) {
    _validate_hard_properties(atom);
    atom_shape(atom_name, atom);
    return atom;
}
exports.atom = atom;
function atom_shape(atom_name, atom_shape) {
    _has_all_properties(atom_name, atom_shape);
    atom_partial(atom_name, atom_shape);
    return true;
}
exports.atom_shape = atom_shape;
function atom_partial(atom_name, partial_atom) {
    _has_no_other_properties(atom_name, partial_atom);
    _validate_primitive_properties(atom_name, partial_atom);
    _validate_partial_atom_bond_properties(atom_name, partial_atom);
    return true;
}
exports.atom_partial = atom_partial;
function property(prop_key, prop_def, prop_value, atom) {
    try {
        _validate_primitive_type(prop_key, prop_def, prop_value);
        _validate_custom_type(prop_key, prop_def, prop_value);
    }
    catch (e) {
        const exc = e;
        if (exc.type === urn_lib_1.urn_exception.ExceptionType.INVALID_ATOM) {
            throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, atom, [prop_key]);
        }
        throw exc;
    }
    return true;
}
exports.property = property;
function encrypt_property(prop_key, prop_def, prop_value) {
    // if(prop_def && prop_def.validation && prop_def.validation.max &&
    //   prop_def.validation.max > conf.get(`max_password_length`)){
    //   prop_def.validation.max = conf.get(`max_password_length`);
    // }
    _custom_validate_string(prop_key, prop_def, prop_value);
    return true;
}
exports.encrypt_property = encrypt_property;
function _has_all_properties(atom_name, atom_shape) {
    const prop_defs = book.get_custom_properties_definition(atom_name);
    const missin_props = [];
    for (const [k] of Object.entries(prop_defs)) {
        if (!atm_util.is_optional_property(atom_name, k) && !urn_lib_1.urn_util.object.has_key(atom_shape, k)) {
            missin_props.push(k);
        }
    }
    for (const [k] of Object.entries(client_1.atom_common_properties)) {
        if (!atm_util.is_optional_property(atom_name, k) && !urn_lib_1.urn_util.object.has_key(atom_shape, k)) {
            missin_props.push(k);
        }
    }
    if (missin_props.length > 0) {
        let err_msg = `schema.Atom is missing the following properties:`;
        err_msg += ` [${missin_props.join(', ')}]`;
        throw urn_exc.create_invalid_atom('MISSING_PROP', err_msg, atom_shape, missin_props);
    }
    return true;
}
function _has_no_other_properties(atom_name, partial_atom) {
    const prop_defs = book.get_custom_properties_definition(atom_name);
    const extra_props = [];
    for (const k in partial_atom) {
        if (urn_lib_1.urn_util.object.has_key(client_1.atom_hard_properties, k)) {
            continue;
        }
        if (urn_lib_1.urn_util.object.has_key(client_1.atom_common_properties, k)) {
            continue;
        }
        if (!urn_lib_1.urn_util.object.has_key(prop_defs, k)) {
            extra_props.push(k);
        }
    }
    if (extra_props.length > 0) {
        let err_msg = `schema.Atom has invalid properties:`;
        err_msg += ` [${extra_props.join(', ')}]`;
        throw urn_exc.create_invalid_atom('INVALID_EXTRA_PROP', err_msg, partial_atom, extra_props);
    }
    return true;
}
function _validate_hard_properties(molecule) {
    let k;
    for (k in client_1.atom_hard_properties) {
        try {
            _validate_primitive_type(k, client_1.atom_hard_properties[k], molecule[k]);
            _validate_custom_type(k, client_1.atom_hard_properties[k], molecule[k]);
        }
        catch (e) {
            const exc = e;
            if (exc.type === urn_lib_1.urn_exception.ExceptionType.INVALID_ATOM) {
                throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, atom, [k]);
            }
            throw exc;
        }
    }
    return true;
}
/**
 * Primitive properties are properties of type: string, number, array, etc.
 * Primitive properties are not of type: ATOM or ATOM_ARRAY
 */
function _validate_primitive_properties(atom_name, partial_atom) {
    const props = book.get_custom_properties_definition(atom_name);
    let k;
    for (k in partial_atom) {
        let prop_def = undefined;
        if (urn_lib_1.urn_util.object.has_key(client_1.atom_hard_properties, k)) {
            prop_def = client_1.atom_hard_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(client_1.atom_common_properties, k)) {
            prop_def = client_1.atom_common_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(props, k)) {
            prop_def = props[k];
        }
        if (!prop_def) {
            const err_msg = `schema.Atom property definition missing for atom \`${atom_name}\` property \`${String(k)}\``;
            throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
        }
        if (prop_def.type === types_1.PropertyType.ATOM || prop_def.type === types_1.PropertyType.ATOM_ARRAY) {
            continue;
        }
        try {
            _validate_primitive_type(k, prop_def, partial_atom[k]);
            _validate_custom_type(k, prop_def, partial_atom[k]);
        }
        catch (e) {
            const exc = e;
            if (exc.type === urn_lib_1.urn_exception.ExceptionType.INVALID_ATOM) {
                throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, partial_atom, [k]);
            }
            throw exc;
        }
    }
    return true;
}
function _validate_partial_atom_bond_properties(atom_name, partial_atom) {
    const props = book.get_custom_properties_definition(atom_name);
    let k;
    for (k in partial_atom) {
        let prop_def = undefined;
        if (urn_lib_1.urn_util.object.has_key(client_1.atom_hard_properties, k)) {
            prop_def = client_1.atom_hard_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(client_1.atom_common_properties, k)) {
            prop_def = client_1.atom_common_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(props, k)) {
            prop_def = props[k];
        }
        if (!prop_def) {
            const err_msg = `schema.Atom property definition missing for atom \`${atom_name}\` property \`${String(k)}\``;
            throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
        }
        if (prop_def.type !== types_1.PropertyType.ATOM && prop_def.type !== types_1.PropertyType.ATOM_ARRAY) {
            continue;
        }
        try {
            _validate_primitive_type(k, prop_def, partial_atom[k]);
        }
        catch (e) {
            const exc = e;
            if (exc.type === urn_lib_1.urn_exception.ExceptionType.INVALID_ATOM) {
                throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, partial_atom, [k]);
            }
            throw exc;
        }
    }
    return true;
}
function _validate_molecule_bond_properties(atom_name, molecule, depth) {
    const props = book.get_custom_properties_definition(atom_name);
    const bond_keys = atm_keys.get_bond(atom_name);
    for (const k of bond_keys) {
        let prop_def = undefined;
        if (urn_lib_1.urn_util.object.has_key(client_1.atom_hard_properties, k)) {
            prop_def = client_1.atom_hard_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(client_1.atom_common_properties, k)) {
            prop_def = client_1.atom_common_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(props, k)) {
            prop_def = props[k];
        }
        if (!prop_def) {
            const err_msg = `schema.Atom property definition missing for atom \`${atom_name}\` property \`${String(k)}\``;
            throw urn_exc.create('CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION', err_msg);
        }
        const subatom_name = atm_util.get_subatom_name(atom_name, k);
        const number_depth = (!depth) ? 0 : depth - 1;
        try {
            const prop_value = molecule[k];
            if (!depth) {
                property(k, prop_def, prop_value, molecule);
            }
            else {
                _validate_bond_type(k, prop_def, prop_value);
                _validate_custom_bond_type(k, prop_def, prop_value);
                if (Array.isArray(prop_value)) {
                    for (const subatom of prop_value) {
                        any(subatom_name, subatom, number_depth);
                    }
                }
                else {
                    any(subatom_name, 
                    // prop_value as schema.Molecule<A,D>,
                    prop_value, number_depth);
                }
            }
        }
        catch (e) {
            const exc = e;
            if (exc.type === urn_lib_1.urn_exception.ExceptionType.INVALID_ATOM) {
                throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, molecule, [k]);
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
        case types_1.PropertyType.ID:
        case types_1.PropertyType.TEXT:
        case types_1.PropertyType.LONG_TEXT:
        case types_1.PropertyType.ENCRYPTED:
        case types_1.PropertyType.EMAIL: {
            if (typeof prop_value !== 'string') {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be a string.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
        case types_1.PropertyType.INTEGER:
        case types_1.PropertyType.FLOAT: {
            if (typeof prop_value !== 'number') {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be a number.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
        case types_1.PropertyType.BINARY: {
            if (typeof prop_value !== 'boolean') {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be a boolean.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
        case types_1.PropertyType.DAY:
        case types_1.PropertyType.TIME: {
            // TODO: To be checked if this should be here.
            if (typeof prop_value === 'string') {
                prop_value = new Date(prop_value);
            }
            if (!urn_lib_1.urn_util.is.date(prop_value)) {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be a Date.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
        case types_1.PropertyType.SET_STRING: {
            if (!Array.isArray(prop_value)) {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be a string array.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
        case types_1.PropertyType.SET_NUMBER: {
            if (!Array.isArray(prop_value)) {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be a number array.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
        case types_1.PropertyType.ENUM_STRING: {
            if (typeof prop_value !== 'string') {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be a string.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            if (!prop_def.values.includes(prop_value)) {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be one of following:`;
                err_msg += ` ['${prop_def.values.join("','")}']`;
                throw urn_exc.create_invalid_atom('INVALID_ENUM_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
        case types_1.PropertyType.ENUM_NUMBER: {
            if (typeof prop_value !== 'number') {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be a number.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            if (!prop_def.values.includes(prop_value)) {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be one of the following:`;
                err_msg += ` [${prop_def.values.join(', ')}]`;
                throw urn_exc.create_invalid_atom('INVALID_ENUM_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
        case types_1.PropertyType.ATOM: {
            if (typeof prop_value !== 'string') {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be a string.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
        case types_1.PropertyType.ATOM_ARRAY: {
            if (!Array.isArray(prop_value)) {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be an Array.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            else if (!prop_value.every((id) => typeof id === 'string')) {
                const err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be an Array of string.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
    }
    // const err_msg = `Invalid schema.Atom type definition.`;
    // throw urn_exc.create('CHECK_PROP_MAIN_TYPE_INVALID_ATM_TYPE',err_msg);
}
function _validate_custom_type(prop_key, prop_def, prop_value, partial_atom) {
    try {
        switch (prop_def.type) {
            case types_1.PropertyType.TEXT:
            case types_1.PropertyType.LONG_TEXT: {
                _custom_validate_string(prop_key, prop_def, prop_value);
                break;
            }
            case types_1.PropertyType.INTEGER:
            case types_1.PropertyType.FLOAT: {
                _custom_validate_number(prop_key, prop_def, prop_value);
                break;
            }
            case types_1.PropertyType.DAY:
            case types_1.PropertyType.TIME: {
                _custom_validate_time(prop_key, prop_def, prop_value);
                break;
            }
            case types_1.PropertyType.SET_STRING: {
                _custom_validate_set_string(prop_key, prop_def, prop_value);
                break;
            }
            case types_1.PropertyType.SET_NUMBER: {
                _custom_validate_set_number(prop_key, prop_def, prop_value);
                break;
            }
        }
    }
    catch (e) {
        const exc = e;
        if (exc.type === urn_lib_1.urn_exception.ExceptionType.INVALID_ATOM) {
            throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, partial_atom, [prop_key]);
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
        case types_1.PropertyType.ATOM: {
            if (typeof prop_value === null || typeof prop_value !== 'object') {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be an object.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
        case types_1.PropertyType.ATOM_ARRAY: {
            if (!Array.isArray(prop_value)) {
                let err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be an Array.`;
                err_msg += ` Type ${typeof prop_value} given.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            else if (!prop_value.every((atom) => typeof atom !== null && typeof atom === 'object')) {
                const err_msg = `Invalid property \`${String(prop_key)}\`. PropertyType should be an Array of object.`;
                throw urn_exc.create_invalid_atom('INVALID_PROP', err_msg, undefined, [prop_key]);
            }
            return true;
        }
    }
    const err_msg = `Invalid schema.Atom type definition.`;
    throw urn_exc.create('CHECK_PROP_MAIN_TYPE_INVALID_ATM_TYPE', err_msg);
}
function _validate_custom_bond_type(prop_key, prop_def, prop_value, partial_atom) {
    try {
        switch (prop_def.type) {
            case types_1.PropertyType.ATOM: {
                _custom_validate_bond_atom(prop_key, prop_def, prop_value);
                break;
            }
            case types_1.PropertyType.ATOM_ARRAY: {
                for (const subatom of prop_value) {
                    _custom_validate_bond_atom(prop_key, prop_def, subatom);
                }
                break;
            }
        }
    }
    catch (e) {
        const exc = e;
        if (exc.type === urn_lib_1.urn_exception.ExceptionType.INVALID_ATOM) {
            throw urn_exc.create_invalid_atom(exc.error_code, exc.msg, partial_atom, [prop_key]);
        }
        throw exc;
    }
}
function _custom_validate_bond_atom(prop_key, prop_def, prop_value) {
    if (prop_def.validation) {
        const vali = prop_def.validation;
        if (vali.date_from) {
            if (prop_value._date < vali.date_from) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Creation _date must be after \`${vali.date_from}\`.`;
                throw urn_exc.create_invalid_atom('DATE_LOWER_THAN_MIN', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.date_until) {
            if (prop_value._date > vali.date_until) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Creation _date must be before \`${vali.date_until}\`.`;
                throw urn_exc.create_invalid_atom('DATE_LOWER_THAN_MIN', err_msg, undefined, [prop_key]);
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
                const err_msg = `Invalid \`${String(prop_key)}\`. Must be alphanumeric /[0-9a-zA-Z]/.`;
                throw urn_exc.create_invalid_atom('STRING_INVALID_ALPHANUM', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.contain_digit && vali.contain_digit === true) {
            if (!/\d/.test(prop_value)) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must contain a digit.`;
                throw urn_exc.create_invalid_atom('STRING_NOT_CONTAIN_DIGIT', err_msg, undefined, [prop_key]);
            }
        }
        else if (vali.contain_digit === false) {
            if (/\d/.test(prop_value)) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must not contain any digit.`;
                throw urn_exc.create_invalid_atom('STRING_CONTAIN_DIGIT', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.contain_lowercase && vali.contain_lowercase === true) {
            if (prop_value.toUpperCase() === prop_value) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must contain a lowercase character.`;
                throw urn_exc.create_invalid_atom('STRING_NOT_CONTAIN_LOWERCASE', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.contain_uppercase && vali.contain_uppercase === true) {
            if (prop_value.toLowerCase() === prop_value) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must contain an uppercase character.`;
                throw urn_exc.create_invalid_atom('STRING_NOT_CONTAIN_UPPERCASE', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.length) {
            if (vali.length !== prop_value.length) {
                let err_msg = `Invalid \`${String(prop_key)}\`. String length must be equal to ${vali.length}.`;
                err_msg += ` Length given ${prop_value.length}`;
                throw urn_exc.create_invalid_atom('STRING_INVALI_LENGTH', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.lowercase && vali.lowercase === true) {
            if (prop_value.toLowerCase() !== prop_value) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must be lowercase.`;
                throw urn_exc.create_invalid_atom('STRING_NOT_LOWERCASE', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.max) {
            if (prop_value.length > vali.max) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Length must be maximum ${vali.max} characters long.`;
                throw urn_exc.create_invalid_atom('STRING_MAX_LENGTH', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.min) {
            if (prop_value.length < vali.min) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Length must be minimum ${vali.min} characters long.`;
                throw urn_exc.create_invalid_atom('STRING_MIN_LENGTH', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.only_letters && vali.only_letters === true) {
            if (!/^[A-Za-z]+$/.test(prop_value)) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must contain only letters.`;
                throw urn_exc.create_invalid_atom('STRING_NOT_ONLY_LETTERS', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.only_numbers) {
            if (!/^[0-9]+$/.test(prop_value)) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must contain only numbers.`;
                throw urn_exc.create_invalid_atom('STRING_NOT_ONLY_NUMBERS', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.reg_ex) {
            if (!vali.reg_ex.test(prop_value)) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Does not satisfy regular expression ${vali.reg_ex}.`;
                throw urn_exc.create_invalid_atom('STRING_INVALID_REG_EX', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.uppercase && vali.uppercase === true) {
            if (prop_value.toUpperCase() !== prop_value) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must be uppercase.`;
                throw urn_exc.create_invalid_atom('STRING_NOT_UPPERCASE', err_msg, undefined, [prop_key]);
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
                const err_msg = `Invalid \`${String(prop_key)}\`. Must be equal to ${vali.eq}.`;
                throw urn_exc.create_invalid_atom('NUMBER_NOTEQ_TO', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.min) {
            if (prop_value < vali.min) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must be grater or equal to ${vali.min}.`;
                throw urn_exc.create_invalid_atom('NUMBER_LOWER_THAN_MIN', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.max) {
            if (prop_value > vali.max) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must be lower or equal to ${vali.max}.`;
                throw urn_exc.create_invalid_atom('NUMBER_GRATER_THAN_MAX', err_msg, undefined, [prop_key]);
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
                const err_msg = `Invalid \`${String(prop_key)}\`. Must be equal to ${vali.eq}.`;
                throw urn_exc.create_invalid_atom('DATE_NOT_EQ_TO', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.min) {
            if (prop_value < vali.min) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must be grater than ${vali.min}.`;
                throw urn_exc.create_invalid_atom('DATE_LOWER_THAN_MIN', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.max) {
            if (prop_value > vali.max) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Must be lower than ${vali.max}.`;
                throw urn_exc.create_invalid_atom('DATE_GRATER_THAN_MAX', err_msg, undefined, [prop_key]);
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
                const err_msg = `Invalid \`${String(prop_key)}\`. Array length must be equal to ${vali.length}.`;
                throw urn_exc.create_invalid_atom('SET_LENGTH_NOT_EQ_TO', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.min) {
            if (prop_value.length < vali.min) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Array length must be greater than ${vali.min}.`;
                throw urn_exc.create_invalid_atom('SET_LENGTH_LOWER_THAN', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.max) {
            if (prop_value.length > vali.max) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Array length must be lower than ${vali.max}.`;
                throw urn_exc.create_invalid_atom('SET_LENGTH_GRATER_THAN', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.values) {
            for (const v of prop_value) {
                if (!vali.values.includes(v)) {
                    let err_msg = `Invalid \`${String(prop_key)}\`. Invalid element. Element must be one of the following:`;
                    err_msg += ` ['${vali.values.join("', '")}']`;
                    throw urn_exc.create_invalid_atom('SET_LENGTH_GRATER_THAN', err_msg, undefined, [prop_key]);
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
                const err_msg = `Invalid \`${String(prop_key)}\`. Array length must be equal to ${vali.length}.`;
                throw urn_exc.create_invalid_atom('SET_LENGTH_NOT_EQ_TO', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.min) {
            if (prop_value.length < vali.min) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Array length must be greater than ${vali.min}.`;
                throw urn_exc.create_invalid_atom('SET_LENGTH_LOWER_THAN', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.max) {
            if (prop_value.length > vali.max) {
                const err_msg = `Invalid \`${String(prop_key)}\`. Array length must be lower than ${vali.max}.`;
                throw urn_exc.create_invalid_atom('SET_LENGTH_GRATER_THAN', err_msg, undefined, [prop_key]);
            }
        }
        if (vali.values) {
            for (const v of prop_value) {
                if (!vali.values.includes(v)) {
                    let err_msg = `Invalid \`${String(prop_key)}\`. Invalid element. Element must be one of the following:`;
                    err_msg += ` [${vali.values.join(', ')}]`;
                    throw urn_exc.create_invalid_atom('SET_LENGTH_GRATER_THAN', err_msg, undefined, [prop_key]);
                }
            }
        }
    }
    return true;
}
//# sourceMappingURL=validate.js.map