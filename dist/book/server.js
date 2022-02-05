"use strict";
/**
 * Module for Server schema.Atom Book Methods
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
exports.has_property = exports.get_all_property_definitions = exports.get_custom_property_definitions = exports.get_property_definition = exports.get_definition = exports.get_all_definitions = exports.validate_name = exports.get_names = exports.add_definition = void 0;
const book_1 = require("../book");
const common = __importStar(require("./common"));
function add_definition(atom_name, atom_definition) {
    const atom_book_def = {};
    atom_book_def[atom_name] = atom_definition;
    Object.assign(book_1.atom_book, { ...atom_book_def, ...book_1.atom_book });
    return book_1.atom_book;
}
exports.add_definition = add_definition;
function get_names() {
    return Object.keys(book_1.atom_book);
}
exports.get_names = get_names;
function validate_name(atom_name) {
    return common.validate_name(atom_name);
}
exports.validate_name = validate_name;
function get_all_definitions() {
    return book_1.atom_book;
}
exports.get_all_definitions = get_all_definitions;
function get_definition(atom_name) {
    return common.get_definition(atom_name);
}
exports.get_definition = get_definition;
function get_property_definition(atom_name, property_name) {
    return common.get_property_definition(atom_name, property_name);
}
exports.get_property_definition = get_property_definition;
function get_custom_property_definitions(atom_name) {
    return common.get_custom_property_definitions(atom_name);
}
exports.get_custom_property_definitions = get_custom_property_definitions;
function get_all_property_definitions(atom_name) {
    return common.get_all_property_definitions(atom_name);
}
exports.get_all_property_definitions = get_all_property_definitions;
function has_property(atom_name, key) {
    return common.has_property(atom_name, key);
}
exports.has_property = has_property;
//# sourceMappingURL=server.js.map