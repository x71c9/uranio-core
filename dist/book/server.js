"use strict";
/**
 * Module for Server Book Methods
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
exports.has_property = exports.get_full_properties_definition = exports.get_custom_property_definitions = exports.get_property_definition = exports.get_definition = exports.get_all_definitions = exports.validate_name = exports.get_names = exports.get_plural = exports.add_definition = void 0;
const atoms_1 = require("../atoms");
const client_book = __importStar(require("./client"));
function add_definition(atom_name, atom_definition) {
    return client_book.add_definition(atom_name, atom_definition);
}
exports.add_definition = add_definition;
function get_plural(atom_name) {
    return client_book.get_plural(atom_name);
}
exports.get_plural = get_plural;
function get_names() {
    return client_book.get_names();
}
exports.get_names = get_names;
function validate_name(atom_name) {
    return client_book.validate_name(atom_name);
}
exports.validate_name = validate_name;
function get_all_definitions() {
    return atoms_1.atom_book;
}
exports.get_all_definitions = get_all_definitions;
function get_definition(atom_name) {
    return client_book.get_definition(atom_name);
}
exports.get_definition = get_definition;
function get_property_definition(atom_name, property_name) {
    return client_book.get_property_definition(atom_name, property_name);
}
exports.get_property_definition = get_property_definition;
function get_custom_property_definitions(atom_name) {
    return client_book.get_custom_property_definitions(atom_name);
}
exports.get_custom_property_definitions = get_custom_property_definitions;
function get_full_properties_definition(atom_name) {
    return client_book.get_full_properties_definition(atom_name);
}
exports.get_full_properties_definition = get_full_properties_definition;
function has_property(atom_name, key) {
    return client_book.has_property(atom_name, key);
}
exports.has_property = has_property;
//# sourceMappingURL=server.js.map