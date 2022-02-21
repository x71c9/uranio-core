"use strict";
/**
 * Static types module
 *
 * This modules defines all the static definitions
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.real_book_property_type = exports.abstract_passport = exports.atom_common_properties = exports.atom_hard_properties = void 0;
const book_cln_1 = require("../typ/book_cln");
exports.atom_hard_properties = {
    _id: {
        type: book_cln_1.PropertyType.ID,
        label: '_id',
    },
    _date: {
        type: book_cln_1.PropertyType.TIME,
        label: '_date',
        default: 'NOW',
        on_error: () => { return new Date(); }
    }
};
exports.atom_common_properties = {
    _r: {
        type: book_cln_1.PropertyType.ID,
        label: '_r',
        optional: true
    },
    _w: {
        type: book_cln_1.PropertyType.ID,
        label: '_w',
        optional: true
    },
    _from: {
        type: book_cln_1.PropertyType.ID,
        label: 'Deleted from',
        optional: true
    }
};
exports.abstract_passport = {
    _id: 'string',
    auth_atom_name: 'string',
    groups: 'string[]'
};
exports.real_book_property_type = {
    ID: 'string',
    TEXT: 'string',
    LONG_TEXT: 'string',
    EMAIL: 'string',
    INTEGER: 'number',
    FLOAT: 'number',
    BINARY: 'boolean',
    ENCRYPTED: 'string',
    DAY: 'datetime',
    TIME: 'datetime',
    ENUM_STRING: 'string',
    ENUM_NUMBER: 'number',
    SET_STRING: 'string[]',
    SET_NUMBER: 'number[]',
    ATOM: 'object',
    ATOM_ARRAY: 'object[]'
};
//# sourceMappingURL=static.js.map