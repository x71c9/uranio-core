"use strict";
/**
 * Atom types module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom_common_properties = exports.atom_hard_properties = void 0;
exports.atom_hard_properties = {
    _id: {
        type: "ID" /* ID */,
        label: '_id',
    },
    _date: {
        type: "TIME" /* TIME */,
        label: '_date',
        default: 'NOW'
    }
};
exports.atom_common_properties = {
    _deleted_from: {
        type: "ID" /* ID */,
        label: 'Deleted from',
        optional: true
    },
    active: {
        type: "BINARY" /* BINARY */,
        label: 'Active'
    }
};
// export const a:Book.Properties.Binary
//# sourceMappingURL=atm.js.map