"use strict";
/**
 * Index module for Atom
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
    get_search_indexes: keys_1.get_search_indexes,
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
__exportStar(require("./encrypt"), exports);
//# sourceMappingURL=server.js.map