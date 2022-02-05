"use strict";
/**
 * Module for schema.Atom Encryption
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.properties = exports.property = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const urn_lib_1 = require("urn-lib");
const conf = __importStar(require("../conf/"));
const book = __importStar(require("../book/client"));
const validate = __importStar(require("./validate"));
// import {
//   schema.AtomName,
//   schema.Atom,
//   schema.AtomShape,
//   Book,
//   BookProperty
// } from '../cln/types';
const types_1 = require("../cln/types");
async function property(atom_name, prop_key, prop_value) {
    const prop_def = book.get_property_definition(atom_name, prop_key);
    validate.encrypt_property(prop_key, prop_def, prop_value);
    // *********
    // IMPORTANT - If the encryption method is changed,
    // *********   DAL._encrypt_changed_properties must be changed too.
    // *********
    const salt = await bcryptjs_1.default.genSalt(conf.get(`encryption_rounds`));
    return await bcryptjs_1.default.hash(prop_value, salt);
}
exports.property = property;
async function properties(atom_name, atom) {
    const prop_defs = book.get_custom_property_definitions(atom_name);
    let k;
    for (k in atom) {
        if (urn_lib_1.urn_util.object.has_key(prop_defs, k)) {
            const prop = prop_defs[k];
            if (prop && prop.type === types_1.BookProperty.ENCRYPTED) {
                atom[k] = await property(atom_name, k, String(atom[k]));
            }
        }
    }
    return atom;
}
exports.properties = properties;
//# sourceMappingURL=encrypt.js.map