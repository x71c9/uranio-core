"use strict";
/**
 * Client Book types module
 *
 * This module defines the type of the `atom_book` for the Client.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionType = exports.SecurityType = exports.PropertyType = void 0;
var PropertyType;
(function (PropertyType) {
    PropertyType["ID"] = "ID";
    PropertyType["TEXT"] = "TEXT";
    PropertyType["LONG_TEXT"] = "LONG_TEXT";
    PropertyType["EMAIL"] = "EMAIL";
    PropertyType["INTEGER"] = "INTEGER";
    PropertyType["FLOAT"] = "FLOAT";
    PropertyType["BINARY"] = "BINARY";
    PropertyType["ENCRYPTED"] = "ENCRYPTED";
    PropertyType["DAY"] = "DAY";
    PropertyType["TIME"] = "TIME";
    PropertyType["ENUM_STRING"] = "ENUM_STRING";
    PropertyType["ENUM_NUMBER"] = "ENUM_NUMBER";
    PropertyType["SET_STRING"] = "SET_STRING";
    PropertyType["SET_NUMBER"] = "SET_NUMBER";
    PropertyType["ATOM"] = "ATOM";
    PropertyType["ATOM_ARRAY"] = "ATOM_ARRAY";
})(PropertyType = exports.PropertyType || (exports.PropertyType = {}));
var SecurityType;
(function (SecurityType) {
    SecurityType["UNIFORM"] = "UNIFORM";
    SecurityType["GRANULAR"] = "GRANULAR";
})(SecurityType = exports.SecurityType || (exports.SecurityType = {}));
var PermissionType;
(function (PermissionType) {
    PermissionType["NOBODY"] = "NOBODY";
    PermissionType["PUBLIC"] = "PUBLIC";
})(PermissionType = exports.PermissionType || (exports.PermissionType = {}));
//# sourceMappingURL=book_cln.js.map