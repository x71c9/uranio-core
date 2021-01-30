"use strict";
/**
 * Class for Access Control Layer
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
exports.create = exports.ACL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('ACL', 'Access Control Module');
const urn_dal = __importStar(require("../dal/"));
const urn_atm = __importStar(require("../atm/"));
const book_1 = require("../../book");
let ACL = class ACL {
    constructor(atom_name, user_groups) {
        this.atom_name = atom_name;
        this.user_groups = user_groups;
        this._dal = urn_dal.create(atom_name);
        const atom_def = book_1.atom_book[atom_name];
        const security = atom_def['security'];
        this._security_type = "UNIFORM" /* UNIFORM */;
        this._read = undefined;
        this._write = undefined;
        if (security) {
            if (typeof security === 'string') {
                if (security === "GRANULAR" /* GRANULAR */) {
                    this._security_type = security;
                }
            }
            else {
                this._read = security._r;
                this._write = security._w;
            }
        }
        this._read_query = { $or: [{ _r: { $exists: 0 } }, { _r: { $in: user_groups } }] };
    }
    _can_uniform_read() {
        if (this._security_type === "UNIFORM" /* UNIFORM */) {
            if (typeof this._read !== 'undefined' && !this.user_groups.includes(this._read)) {
                throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Read unauthorized');
            }
        }
    }
    _can_uniform_write() {
        if (this._security_type === "UNIFORM" /* UNIFORM */) {
            if (typeof this._write === 'undefined' || !this.user_groups.includes(this._write)) {
                throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Write unauthorized');
            }
        }
    }
    _can_atom_write(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const atom = yield this._dal.select_by_id(id);
            if (!atom._w || !this.user_groups.includes(atom._w)) {
                throw urn_exc.create_unauthorized('UNAUTHORIZED', 'Write unauthorized');
            }
            return true;
        });
    }
    filter_uniform_bond_properties(molecule, depth = 0) {
        const bond_keys = urn_atm.get_bond_keys(this.atom_name);
        let k;
        for (k of bond_keys) {
            const subatom_name = urn_atm.get_subatom_name(this.atom_name, k);
            const acl = create(subatom_name, this.user_groups);
            try {
                acl._can_uniform_read();
                if (depth) {
                    const prop_value = molecule[k];
                    if (Array.isArray(prop_value)) {
                        for (let subatom of prop_value) {
                            subatom = acl.filter_uniform_bond_properties(subatom, depth - 1);
                        }
                    }
                    else {
                        molecule[k] = acl.filter_uniform_bond_properties(molecule[k], depth - 1);
                    }
                }
            }
            catch (err) {
                if (err.type === "UNAUTHORIZED" /* UNAUTHORIZED */) {
                    // molecule[k] = (Array.isArray(molecule[k])) ? [] : '' as any;
                    delete molecule[k];
                }
                else {
                    throw err;
                }
            }
        }
        return molecule;
    }
    select(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this._can_uniform_read();
            if (this._security_type === "GRANULAR" /* GRANULAR */) {
                query = { $and: [query, this._read_query] };
                if (!options) {
                    options = {};
                }
                options.depth_query = query;
            }
            const molecules = yield this._dal.select(query, options);
            return molecules.map((m) => {
                const depth = (options) ? options.depth : 0;
                return this.filter_uniform_bond_properties(m, depth);
            });
        });
    }
    select_by_id(id, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            this._can_uniform_read();
            const options = { depth: depth };
            let query = { _id: id };
            if (this._security_type === "GRANULAR" /* GRANULAR */) {
                query = { $and: [query, this._read_query] };
                options.depth_query = query;
            }
            return yield this._dal.select_one(query, options);
        });
    }
    select_one(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            this._can_uniform_read();
            if (this._security_type === "GRANULAR" /* GRANULAR */) {
                query = { $and: [query, this._read_query] };
                if (!options) {
                    options = {};
                }
                options.depth_query = query;
            }
            return yield this._dal.select_one(query, options);
        });
    }
    insert_one(atom_shape) {
        return __awaiter(this, void 0, void 0, function* () {
            this._can_uniform_write();
            return yield this._dal.insert_one(atom_shape);
        });
    }
    alter_by_id(id, partial_atom) {
        return __awaiter(this, void 0, void 0, function* () {
            this._can_uniform_write();
            if (this._security_type === "GRANULAR" /* GRANULAR */) {
                this._can_atom_write(id);
            }
            return yield this._dal.alter_by_id(id, partial_atom);
        });
    }
    delete_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            this._can_uniform_write();
            if (this._security_type === "GRANULAR" /* GRANULAR */) {
                this._can_atom_write(id);
            }
            return yield this._dal.delete_by_id(id);
        });
    }
};
ACL = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], ACL);
exports.ACL = ACL;
function create(atom_name, user_groups) {
    urn_lib_1.urn_log.fn_debug(`Create ACL [${atom_name}]`, user_groups);
    return new ACL(atom_name, user_groups);
}
exports.create = create;
//# sourceMappingURL=acl.js.map