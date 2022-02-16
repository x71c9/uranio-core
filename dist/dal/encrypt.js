"use strict";
/**
 * Class for Encrypt Data Access Layer
 *
 * This class handle schema.Atom's encrypted properties.
 * It will encrypt before `insert_one`
 * It will also check if a property with ENCRYPT type has changed and encrypt
 * it again before `alter_by_id`.
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_encrypt = exports.EncryptDAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init(`DAL_ENCRYPT`, `Encryption DAL.`);
const atm_encrypt = __importStar(require("../atm/encrypt"));
const book = __importStar(require("../book/index"));
const types = __importStar(require("../types"));
const basic_1 = require("./basic");
const validate_1 = require("./validate");
let EncryptDAL = class EncryptDAL extends validate_1.ValidateDAL {
    constructor(atom_name) {
        super(atom_name);
        this.abstract_dal = (0, basic_1.create_basic)(this.atom_name, this._db_relation);
    }
    async insert_one(atom_shape) {
        atom_shape = await atm_encrypt.properties(this.atom_name, atom_shape);
        return await super.insert_one(atom_shape);
    }
    async alter_by_id(id, partial_atom) {
        partial_atom = await this._encrypt_changed_properties(id, partial_atom);
        return super.alter_by_id(id, partial_atom);
    }
    async insert_multiple(atom_shapes) {
        for (let atom_shape of atom_shapes) {
            atom_shape = await atm_encrypt.properties(this.atom_name, atom_shape);
        }
        return await super.insert_multiple(atom_shapes);
    }
    async alter_multiple(ids, partial_atom) {
        partial_atom = await atm_encrypt.properties(this.atom_name, partial_atom);
        return super.alter_multiple(ids, partial_atom);
    }
    async _encrypt_changed_properties(id, atom) {
        const all_props = book.get_full_properties_definition(this.atom_name);
        let k;
        for (k in atom) {
            const prop_def = all_props[k];
            if (prop_def && prop_def.type === types.BookProperty.ENCRYPTED) {
                let value = atom[k];
                if (typeof value !== 'string') {
                    throw urn_exc.create_invalid_atom(`INVALID_ENCRYPTED_PROP_VALUE_TYPE`, `Property [${k}] of type ENCRYPTED must be of type \`string\`.`);
                }
                if (value.length !== 60 || !value.startsWith('$2')) {
                    value = await atm_encrypt.property(this.atom_name, k, value);
                }
                else {
                    const res_select = await this.abstract_dal.select_by_id(id);
                    const db_prop = res_select[k];
                    if (db_prop && db_prop !== value) {
                        value = await atm_encrypt.property(this.atom_name, k, value);
                    }
                }
                atom[k] = value;
            }
        }
        return atom;
    }
};
EncryptDAL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], EncryptDAL);
exports.EncryptDAL = EncryptDAL;
function create_encrypt(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create EncrtyptDAL [${atom_name}]`);
    return new EncryptDAL(atom_name);
}
exports.create_encrypt = create_encrypt;
//# sourceMappingURL=encrypt.js.map