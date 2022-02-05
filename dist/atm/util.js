"use strict";
/**
 * Module for schema.Atom Util
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.delete_undefined_optional = exports.has_property = exports.is_optional_property = exports.hide_hidden_properties = exports.is_auth_atom = exports.is_auth_atom_name = exports.is_molecule = exports.is_atom = exports.get_subatom_name = exports.molecule_to_atom = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('ATOM_UTIL', `schema.Atom Util module`);
const keys = __importStar(require("./keys"));
const book_cln_1 = require("../typ/book_cln");
const book = __importStar(require("../book/client"));
function molecule_to_atom(atom_name, molecule) {
    const bond_keys = keys.get_bond(atom_name);
    // let k:keyof schema.Molecule<A,D>;
    for (const k of bond_keys) {
        const prop_value = molecule[k];
        if (Array.isArray(prop_value)) {
            for (let i = 0; i < prop_value.length; i++) {
                prop_value[i] = (prop_value[i]._id) ? prop_value[i]._id : null;
            }
        }
        else {
            molecule[k] = (prop_value._id) ? prop_value._id : null;
        }
    }
    return molecule;
}
exports.molecule_to_atom = molecule_to_atom;
function get_subatom_name(atom_name, atom_key) {
    const atom_def = book.get_custom_property_definitions(atom_name);
    const key_string = atom_key;
    const prop = atom_def[key_string];
    if (prop) {
        if (prop.type === book_cln_1.BookProperty.ATOM || prop.type === book_cln_1.BookProperty.ATOM_ARRAY) {
            if (atom_def[key_string].atom) {
                return atom_def[key_string].atom;
            }
            else {
                let err_msg = `Invalid book property definition for [${key_string}].`;
                err_msg += ` Missing 'atom' field.`;
                throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP', err_msg);
            }
        }
        else {
            let err_msg = `Invalid book property type for \`${key_string}\`.`;
            err_msg += ` Type shlould be ATOM or ATOM_ARRAY.`;
            throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP_TYPE', err_msg);
        }
    }
    else {
        let err_msg = `Invalid key \`${key_string}\`.`;
        err_msg += ` Key should be an schema.AtomName.`;
        throw urn_exc.create('GET_ATOM_NAME_INVALID_KEY', err_msg);
    }
}
exports.get_subatom_name = get_subatom_name;
function is_atom(atom_name, atom) {
    const subatom_keys = keys.get_bond(atom_name);
    for (const subkey of subatom_keys) {
        const value = atom[subkey];
        if (Array.isArray(value)) {
            if (typeof value[0] === 'object') {
                return false;
            }
        }
        else if (typeof value === 'object') {
            return false;
        }
    }
    return true;
}
exports.is_atom = is_atom;
function is_molecule(atom_name, molecule) {
    const subatom_keys = keys.get_bond(atom_name);
    for (const subkey of subatom_keys) {
        const value = molecule[subkey];
        if (Array.isArray(value)) {
            if (typeof value[0] === 'string') {
                return false;
            }
        }
        else if (typeof value === 'string') {
            return false;
        }
    }
    return true;
}
exports.is_molecule = is_molecule;
function is_auth_atom_name(atom_name) {
    const atom_def = book.get_definition(atom_name);
    if (atom_def.authenticate === true) {
        return true;
    }
    return false;
}
exports.is_auth_atom_name = is_auth_atom_name;
function is_auth_atom(atom) {
    if (urn_lib_1.urn_util.object.has_key(atom, 'email') &&
        urn_lib_1.urn_util.object.has_key(atom, 'password') &&
        urn_lib_1.urn_util.object.has_key(atom, 'groups')) {
        return true;
    }
    return false;
}
exports.is_auth_atom = is_auth_atom;
function hide_hidden_properties(atom_name, molecules) {
    if (Array.isArray(molecules)) {
        for (let i = 0; i < molecules.length; i++) {
            molecules[i] = _hide_hidden_properties_single_molecule(atom_name, molecules[i]);
        }
    }
    else {
        molecules = _hide_hidden_properties_single_molecule(atom_name, molecules);
    }
    return molecules;
}
exports.hide_hidden_properties = hide_hidden_properties;
function _hide_hidden_properties_single_molecule(atom_name, molecule) {
    const hidden_keys = keys.get_hidden(atom_name);
    const bond_keys = keys.get_bond(atom_name);
    if (is_atom(atom_name, molecule)) {
        for (const k of hidden_keys) {
            delete molecule[k];
        }
    }
    else {
        for (const k in molecule) {
            if (hidden_keys.has(k)) {
                delete molecule[k];
            }
            else if (bond_keys.has(k)) {
                const subatom_name = get_subatom_name(atom_name, k);
                molecule[k] = _hide_hidden_properties_single_molecule(subatom_name, molecule[k]);
            }
        }
    }
    return molecule;
}
function is_optional_property(atom_name, key) {
    const prop_def = book.get_property_definition(atom_name, key);
    return (prop_def &&
        urn_lib_1.urn_util.object.has_key(prop_def, 'optional') &&
        prop_def.optional === true);
}
exports.is_optional_property = is_optional_property;
function has_property(atom_name, key) {
    return book.has_property(atom_name, key);
}
exports.has_property = has_property;
function delete_undefined_optional(atom_name, partial_atom) {
    const optional_keys = keys.get_optional(atom_name);
    let k;
    for (k in partial_atom) {
        if (optional_keys.has(k) && !partial_atom[k]) {
            delete partial_atom[k];
        }
    }
    return partial_atom;
}
exports.delete_undefined_optional = delete_undefined_optional;
//# sourceMappingURL=util.js.map