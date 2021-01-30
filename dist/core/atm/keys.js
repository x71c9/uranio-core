"use strict";
/**
 * Module for Atom Keys
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_subatom_non_array_keys = exports.get_subatom_array_keys = exports.get_bond_keys = exports.get_unique_keys = exports.get_encrypted_keys = void 0;
const book_1 = require("../../book");
const types_1 = require("../types");
function get_encrypted_keys(atom_name) {
    const encrypt_keys = new Set();
    const atom_props = book_1.atom_book[atom_name]['properties'];
    for (const k in atom_props) {
        const prop = atom_props[k];
        if (prop.type && prop.type === "ENCRYPTED" /* ENCRYPTED */) {
            encrypt_keys.add(k);
        }
    }
    return encrypt_keys;
}
exports.get_encrypted_keys = get_encrypted_keys;
function get_unique_keys(atom_name) {
    const unique_keys = new Set();
    const atom_props = book_1.atom_book[atom_name]['properties'];
    for (const k in atom_props) {
        const prop = atom_props[k];
        if (prop.unique && prop.unique === true) {
            unique_keys.add(k);
        }
    }
    let k;
    for (k in types_1.atom_common_properties) {
        const prop = types_1.atom_common_properties[k];
        if (prop.unique && prop.unique === true) {
            unique_keys.add(k);
        }
    }
    return unique_keys;
}
exports.get_unique_keys = get_unique_keys;
function get_bond_keys(atom_name) {
    const subatom_keys = new Set();
    const atom_props = book_1.atom_book[atom_name]['properties'];
    for (const k in atom_props) {
        const prop = atom_props[k];
        if (prop.type && prop.type === "ATOM" /* ATOM */ || prop.type === "ATOM_ARRAY" /* ATOM_ARRAY */) {
            subatom_keys.add(k);
        }
    }
    return subatom_keys;
}
exports.get_bond_keys = get_bond_keys;
function get_subatom_array_keys(atom_name) {
    const subatom_keys = new Set();
    const atom_props = book_1.atom_book[atom_name]['properties'];
    for (const k in atom_props) {
        const prop = atom_props[k];
        if (prop.type === "ATOM_ARRAY" /* ATOM_ARRAY */) {
            subatom_keys.add(k);
        }
    }
    return subatom_keys;
}
exports.get_subatom_array_keys = get_subatom_array_keys;
function get_subatom_non_array_keys(atom_name) {
    const subatom_keys = new Set();
    const atom_props = book_1.atom_book[atom_name]['properties'];
    for (const k in atom_props) {
        const prop = atom_props[k];
        if (prop.type === "ATOM" /* ATOM */) {
            subatom_keys.add(k);
        }
    }
    return subatom_keys;
}
exports.get_subatom_non_array_keys = get_subatom_non_array_keys;
//# sourceMappingURL=keys.js.map