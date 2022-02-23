"use strict";
/**
 * Client Index module for Atom
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fix = exports.util = exports.keys = exports.validate = void 0;
const validate_1 = require("./validate");
exports.validate = {
    any: validate_1.any,
    molecule: validate_1.molecule,
    atom: validate_1.atom,
    atom_shape: validate_1.atom_shape,
    atom_partial: validate_1.atom_partial,
    property: validate_1.property,
};
const keys_1 = require("./keys");
exports.keys = {
    get_hidden: keys_1.get_hidden,
    get_encrypted: keys_1.get_encrypted,
    get_unique: keys_1.get_unique,
    get_bond: keys_1.get_bond,
    get_bond_array: keys_1.get_bond_array,
    get_bond_non_array: keys_1.get_bond_non_array
};
const util_1 = require("./util");
exports.util = {
    has_property: util_1.has_property,
    molecule_to_atom: util_1.molecule_to_atom,
    get_subatom_name: util_1.get_subatom_name,
    is_atom: util_1.is_atom,
    is_molecule: util_1.is_molecule,
    is_auth_atom_name: util_1.is_auth_atom_name,
    is_auth_atom: util_1.is_auth_atom,
    is_optional_property: util_1.is_optional_property,
    hide_hidden_properties: util_1.hide_hidden_properties,
    delete_undefined_optional: util_1.delete_undefined_optional
};
const fix_1 = require("./fix");
exports.fix = {
    property: fix_1.property
};
//# sourceMappingURL=client.js.map