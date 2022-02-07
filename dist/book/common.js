"use strict";
/**
 * Common module for schema.Atom Book Methods
 *
 * Since type Book is different between Server and Client we need two different
 * module with methods with different return types.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.has_property = exports.get_all_property_definitions = exports.get_custom_property_definitions = exports.get_property_definition = exports.get_definition = exports.get_all_definitions = exports.validate_auth_name = exports.validate_name = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('BOOK_METHODS_MODULE', `Book methods module`);
const base_1 = require("../base");
const stc_1 = require("../stc/");
function validate_name(atom_name) {
    return urn_lib_1.urn_util.object.has_key(base_1.atom_book, atom_name);
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
function get_all_definitions() {
    return base_1.atom_book;
}
exports.get_all_definitions = get_all_definitions;
function get_definition(atom_name) {
    return base_1.atom_book[atom_name];
}
exports.get_definition = get_definition;
function get_property_definition(atom_name, property_name) {
    const prop_defs = base_1.atom_book[atom_name].properties;
    if (urn_lib_1.urn_util.object.has_key(prop_defs, property_name)) {
        return prop_defs[property_name];
    }
    else if (urn_lib_1.urn_util.object.has_key(stc_1.atom_hard_properties, property_name)) {
        return stc_1.atom_hard_properties[property_name];
    }
    else if (urn_lib_1.urn_util.object.has_key(stc_1.atom_common_properties, property_name)) {
        return stc_1.atom_common_properties[property_name];
    }
    throw urn_exc.create('INVALID_PROPERTY_NAME', `Definition for \`${property_name}\` for schema.Atom \`${atom_name}\` not found.`);
}
exports.get_property_definition = get_property_definition;
function get_custom_property_definitions(atom_name) {
    const atom_def = base_1.atom_book[atom_name];
    return atom_def.properties;
}
exports.get_custom_property_definitions = get_custom_property_definitions;
function get_all_property_definitions(atom_name) {
    const custom_defs = get_custom_property_definitions(atom_name);
    const prop_defs = {
        ...stc_1.atom_hard_properties,
        ...stc_1.atom_common_properties,
        ...custom_defs
    };
    return prop_defs;
}
exports.get_all_property_definitions = get_all_property_definitions;
function has_property(atom_name, key) {
    if (urn_lib_1.urn_util.object.has_key(stc_1.atom_hard_properties, key)) {
        return true;
    }
    if (urn_lib_1.urn_util.object.has_key(stc_1.atom_common_properties, key)) {
        return true;
    }
    if (urn_lib_1.urn_util.object.has_key(base_1.atom_book[atom_name]['properties'], key)) {
        return true;
    }
    return false;
}
exports.has_property = has_property;
//# sourceMappingURL=common.js.map