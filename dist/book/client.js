"use strict";
/**
 * Module for Client Book Methods
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.has_property = exports.get_properties_definition = exports.get_custom_properties_definition = exports.get_property_definition = exports.get_definition = exports.get_all_definitions = exports.get_plural = exports.validate_auth_name = exports.validate_name = exports.get_names = exports.add_definition = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('BOOK_METHODS_MODULE', `Book methods module`);
const atoms_1 = require("../atoms");
const client_1 = require("../stc/client");
function add_definition(atom_name, atom_definition) {
    const atom_book = get_all_definitions();
    atom_book[atom_name] = atom_definition;
    return atom_book;
}
exports.add_definition = add_definition;
function get_names() {
    return Object.keys(atoms_1.atom_book);
}
exports.get_names = get_names;
function validate_name(atom_name) {
    return urn_lib_1.urn_util.object.has_key(atoms_1.atom_book, atom_name);
}
exports.validate_name = validate_name;
function validate_auth_name(auth_name) {
    if (!validate_name(auth_name)) {
        return false;
    }
    const atom_def = get_definition(auth_name);
    return atom_def.authenticate === true;
}
exports.validate_auth_name = validate_auth_name;
function get_plural(atom_name) {
    const atom_def = get_definition(atom_name);
    if (typeof atom_def.plural === 'string' && atom_def.plural !== '') {
        return atom_def.plural;
    }
    return `${atom_name}s`;
}
exports.get_plural = get_plural;
function get_all_definitions() {
    return atoms_1.atom_book;
}
exports.get_all_definitions = get_all_definitions;
function get_definition(atom_name) {
    return atoms_1.atom_book[atom_name];
}
exports.get_definition = get_definition;
function get_property_definition(atom_name, property_name) {
    const all_prop_def = get_properties_definition(atom_name);
    if (!urn_lib_1.urn_util.object.has_key(all_prop_def, property_name)) {
        throw urn_exc.create('INVALID_PROPERTY_NAME', `Definition for \`${property_name}\` for Atom \`${atom_name}\` not found.`);
    }
    return all_prop_def[property_name];
}
exports.get_property_definition = get_property_definition;
function get_custom_properties_definition(atom_name) {
    const atom_def = atoms_1.atom_book[atom_name];
    return atom_def.properties;
}
exports.get_custom_properties_definition = get_custom_properties_definition;
function get_properties_definition(atom_name) {
    const custom_defs = get_custom_properties_definition(atom_name);
    const prop_defs = {
        ...client_1.atom_hard_properties,
        ...client_1.atom_common_properties,
        ...custom_defs
    };
    return prop_defs;
}
exports.get_properties_definition = get_properties_definition;
function has_property(atom_name, key) {
    if (urn_lib_1.urn_util.object.has_key(client_1.atom_hard_properties, key)) {
        return true;
    }
    if (urn_lib_1.urn_util.object.has_key(client_1.atom_common_properties, key)) {
        return true;
    }
    if (urn_lib_1.urn_util.object.has_key(atoms_1.atom_book[atom_name]['properties'], key)) {
        return true;
    }
    return false;
}
exports.has_property = has_property;
//# sourceMappingURL=client.js.map