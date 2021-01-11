"use strict";
/**
 * Module for Atom Encryption
 *
 * @packageDocumentation
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt_properties = exports.encrypt_property = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const urn_lib_1 = require("urn-lib");
const defaults_1 = require("../conf/defaults");
const book_1 = require("../book");
const validate_1 = require("./validate");
function encrypt_property(atom_name, prop_key, prop_value) {
    return __awaiter(this, void 0, void 0, function* () {
        const atom_props = book_1.atom_book[atom_name]['properties'];
        validate_1._validate_encrypt_property(prop_key, atom_props[prop_key], prop_value);
        // *********
        // IMPORTANT - If the encryption method is changed,
        // *********   DAL._encrypt_changed_properties must be changed too.
        // *********
        const salt = yield bcrypt_1.default.genSalt(defaults_1.core_config.encryption_round);
        return yield bcrypt_1.default.hash(prop_value, salt);
    });
}
exports.encrypt_property = encrypt_property;
function encrypt_properties(atom_name, atom) {
    return __awaiter(this, void 0, void 0, function* () {
        const atom_props = book_1.atom_book[atom_name]['properties'];
        let k;
        for (k in atom) {
            if (urn_lib_1.urn_util.object.has_key(atom_props, k) &&
                atom_props[k] &&
                atom_props[k].type === "ENCRYPTED" /* ENCRYPTED */) {
                atom[k] = (yield encrypt_property(atom_name, k, atom[k]));
            }
        }
        return atom;
    });
}
exports.encrypt_properties = encrypt_properties;
//# sourceMappingURL=encrypt.js.map