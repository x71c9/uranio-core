"use strict";
/**
 * Class for Encrypt Data Access Layer
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_encrypt = exports.EncryptDAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_atm = __importStar(require("../atm/"));
const book_1 = require("../book");
const types_1 = require("../types");
const basic_1 = require("./basic");
const validate_1 = require("./validate");
let EncryptDAL = class EncryptDAL extends validate_1.ValidateDAL {
    insert_one(atom_shape) {
        const _super = Object.create(null, {
            insert_one: { get: () => super.insert_one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            atom_shape = yield urn_atm.encrypt_properties(this.atom_name, atom_shape);
            return yield _super.insert_one.call(this, atom_shape);
        });
    }
    alter_by_id(id, partial_atom) {
        const _super = Object.create(null, {
            alter_by_id: { get: () => super.alter_by_id }
        });
        return __awaiter(this, void 0, void 0, function* () {
            partial_atom = yield this._encrypt_changed_properties(id, partial_atom);
            return _super.alter_by_id.call(this, id, partial_atom);
        });
    }
    _encrypt_changed_properties(id, atom) {
        return __awaiter(this, void 0, void 0, function* () {
            const atom_props = book_1.atom_book[this.atom_name]['properties'];
            const all_props = Object.assign(Object.assign(Object.assign({}, types_1.atom_hard_properties), types_1.atom_common_properties), atom_props);
            let k;
            for (k in atom) {
                const prop_def = all_props[k];
                if (prop_def && prop_def.type && prop_def.type === "ENCRYPTED" /* ENCRYPTED */) {
                    let value = atom[k];
                    if (value && typeof value === 'string' && (value.length !== 60 || !value.startsWith('$2'))) {
                        value = yield urn_atm.encrypt_property(this.atom_name, k, value);
                    }
                    else {
                        const abstract_dal = basic_1.create_basic(this.atom_name, this._db_relation);
                        const res_select = yield abstract_dal.select_by_id(id);
                        const db_prop = res_select[k];
                        if (db_prop && db_prop !== value) {
                            value = yield urn_atm.encrypt_property(this.atom_name, k, value);
                        }
                    }
                    atom[k] = value;
                }
            }
            return atom;
        });
    }
};
EncryptDAL = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], EncryptDAL);
exports.EncryptDAL = EncryptDAL;
function create_encrypt(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create EncrtyptDAL [${atom_name}]`);
    return new EncryptDAL(atom_name);
}
exports.create_encrypt = create_encrypt;
//# sourceMappingURL=encrypt.js.map