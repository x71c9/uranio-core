"use strict";
/**
 * Module for schema.Atom Keys
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
exports.get_bond_non_array = exports.get_bond_array = exports.get_bond = exports.get_unique = exports.get_encrypted = exports.get_hidden = exports.get_optional = void 0;
const book_cln_1 = require("../typ/book_cln");
const book = __importStar(require("../book/client"));
const client_1 = require("../stc/client");
function get_optional(atom_name) {
    const optional_keys = new Set();
    const prop_defs = book.get_custom_property_definitions(atom_name);
    for (const k in prop_defs) {
        const prop = prop_defs[k];
        if (prop.optional && prop.optional === true) {
            optional_keys.add(k);
        }
    }
    let k;
    for (k in client_1.atom_common_properties) {
        const prop = client_1.atom_common_properties[k];
        if (prop.optional && prop.optional === true) {
            optional_keys.add(k);
        }
    }
    return optional_keys;
}
exports.get_optional = get_optional;
function get_hidden(atom_name) {
    const hidden_keys = new Set();
    const prop_defs = book.get_custom_property_definitions(atom_name);
    for (const k in prop_defs) {
        const prop = prop_defs[k];
        if (prop.hidden && prop.hidden === true) {
            hidden_keys.add(k);
        }
    }
    let k;
    for (k in client_1.atom_common_properties) {
        const prop = client_1.atom_common_properties[k];
        if (prop.hidden && prop.hidden === true) {
            hidden_keys.add(k);
        }
    }
    return hidden_keys;
}
exports.get_hidden = get_hidden;
function get_encrypted(atom_name) {
    const encrypt_keys = new Set();
    const prop_defs = book.get_custom_property_definitions(atom_name);
    for (const k in prop_defs) {
        const prop = prop_defs[k];
        if (prop.type && prop.type === book_cln_1.PropertyType.ENCRYPTED) {
            encrypt_keys.add(k);
        }
    }
    let k;
    for (k in client_1.atom_common_properties) {
        const prop = client_1.atom_common_properties[k];
        // eslint-disable-next-line
        // @ts-ignore
        if (prop.type && prop.type === book_cln_1.PropertyType.ENCRYPTED) {
            encrypt_keys.add(k);
        }
    }
    return encrypt_keys;
}
exports.get_encrypted = get_encrypted;
function get_unique(atom_name) {
    const unique_keys = new Set();
    const prop_defs = book.get_custom_property_definitions(atom_name);
    for (const k in prop_defs) {
        const prop = prop_defs[k];
        if (prop.unique && prop.unique === true) {
            unique_keys.add(k);
        }
    }
    let k;
    for (k in client_1.atom_common_properties) {
        const prop = client_1.atom_common_properties[k];
        if (prop.unique && prop.unique === true) {
            unique_keys.add(k);
        }
    }
    return unique_keys;
}
exports.get_unique = get_unique;
function get_bond(atom_name) {
    const subatom_keys = new Set();
    const prop_defs = book.get_custom_property_definitions(atom_name);
    for (const k in prop_defs) {
        const prop = prop_defs[k];
        if (prop.type && prop.type === book_cln_1.PropertyType.ATOM || prop.type === book_cln_1.PropertyType.ATOM_ARRAY) {
            subatom_keys.add(k);
        }
    }
    return subatom_keys;
}
exports.get_bond = get_bond;
function get_bond_array(atom_name) {
    const subatom_keys = new Set();
    const prop_defs = book.get_custom_property_definitions(atom_name);
    for (const k in prop_defs) {
        const prop = prop_defs[k];
        if (prop.type === book_cln_1.PropertyType.ATOM_ARRAY) {
            subatom_keys.add(k);
        }
    }
    return subatom_keys;
}
exports.get_bond_array = get_bond_array;
function get_bond_non_array(atom_name) {
    const subatom_keys = new Set();
    const prop_defs = book.get_custom_property_definitions(atom_name);
    for (const k in prop_defs) {
        const prop = prop_defs[k];
        if (prop.type === book_cln_1.PropertyType.ATOM) {
            subatom_keys.add(k);
        }
    }
    return subatom_keys;
}
exports.get_bond_non_array = get_bond_non_array;
//# sourceMappingURL=keys.js.map