"use strict";
/**
 * Mongoose Relation module
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.MongooseRelation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const urn_lib_1 = require("urn-lib");
const defaults_1 = require("../../conf/defaults");
const urn_atm = __importStar(require("../../atm/"));
const models_1 = require("./models");
const urn_exc = urn_lib_1.urn_exception.init('REL_MONGO', 'Mongoose Relation');
/**
 * Mongoose Relation class
 */
let MongooseRelation = class MongooseRelation {
    constructor(atom_name) {
        this.atom_name = atom_name;
        this._conn_name = this._get_conn_name();
        const models_map = models_1.models_by_connection.get(this._conn_name);
        if (!models_map) {
            const err_msg = `Cannot find models for connection [${this._conn_name}]`;
            throw urn_exc.create('MODELS_NOT_FOUND', err_msg);
        }
        const model = models_map.get(this.atom_name);
        if (!model) {
            let err_msg = `Cannot find model for atom [${this.atom_name}]`;
            err_msg += ` and connection [${this._conn_name}]`;
            throw urn_exc.create('MODEL_NOT_FOUND', err_msg);
        }
        this._raw = model;
    }
    _get_conn_name() {
        return 'main';
    }
    select(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let mon_find_res = [];
            if (options) {
                mon_find_res = yield this._raw.find(query, null, options)
                    .populate(_generate_populate_obj(this.atom_name, options.depth, options.depth_query))
                    .lean();
            }
            else {
                mon_find_res = yield this._raw.find(query).lean();
            }
            return mon_find_res.map((mon_doc) => {
                return _clean_molecule(this.atom_name, mon_doc);
            });
        });
    }
    select_by_id(id, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof depth !== 'undefined' && typeof depth !== 'number') {
                const err_msg = `Invalid depth type, Depth should be a number.`;
                throw urn_exc.create('SELECT_BY_ID_INVALID_DEPTH', err_msg);
            }
            let mon_find_by_id_res;
            if (depth && depth > 0) {
                const populate_object = _generate_populate_obj(this.atom_name, depth);
                mon_find_by_id_res = yield this._raw.findById(id)
                    .populate(populate_object).lean();
            }
            else {
                mon_find_by_id_res = yield this._raw.findById(id).lean();
            }
            if (mon_find_by_id_res === null) {
                throw urn_exc.create_not_found('FIND_ID_NOT_FOUND', `Record not found.`);
            }
            return _clean_molecule(this.atom_name, mon_find_by_id_res);
        });
    }
    select_one(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let mon_find_one_res;
            if (options) {
                mon_find_one_res = yield this._raw.findOne(query).sort(options.sort)
                    .populate(_generate_populate_obj(this.atom_name, options.depth, options.depth_query))
                    .lean();
            }
            else {
                mon_find_one_res = yield this._raw.findOne(query).lean();
            }
            if (mon_find_one_res === null) {
                throw urn_exc.create_not_found('FIND_ONE_NOT_FOUND', `Record not found.`);
            }
            return _clean_molecule(this.atom_name, mon_find_one_res);
        });
    }
    insert_one(atom_shape) {
        return __awaiter(this, void 0, void 0, function* () {
            if (urn_lib_1.urn_util.object.has_key(atom_shape, '_id')) {
                delete atom_shape._id;
            }
            const mon_model = new this._raw(atom_shape);
            const mon_res_doc = yield mon_model.save();
            const str_id = mon_res_doc._id.toString();
            const mon_obj = mon_res_doc.toObject();
            mon_obj._id = str_id;
            return mon_obj;
        });
    }
    alter_by_id(id, partial_atom) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof id !== 'string' || id === '' || !this.is_valid_id(id)) {
                const err_msg = `Cannot alter_by_id. Invalid id param.`;
                throw urn_exc.create('ALTER_BY_ID_INVALID_ID', err_msg);
            }
            const mon_update_res = yield this._raw.findByIdAndUpdate({ _id: id }, partial_atom, { new: true, lean: true });
            if (mon_update_res === null) {
                throw urn_exc.create('ALTER_BY_ID_NOT_FOUND', `Cannot alter_by_id. Record not found.`);
            }
            return _clean_atom(this.atom_name, mon_update_res);
        });
    }
    replace_by_id(id, atom) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof id !== 'string' || id === '' || !this.is_valid_id(id)) {
                const err_msg = `Cannot replace_by_id. Invalid id param.`;
                throw urn_exc.create('REPLACE_BY_ID_INVALID_ID', err_msg);
            }
            const mon_update_res = yield this._raw.findByIdAndUpdate({ _id: id }, atom, { new: true, lean: true, overwrite: true });
            if (mon_update_res === null) {
                throw urn_exc.create('REPLACE_BY_ID_NOT_FOUND', `Cannot replace_by_id. Record not found.`);
            }
            const cleaned = _clean_atom(this.atom_name, mon_update_res);
            return cleaned;
        });
    }
    delete_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof id !== 'string' || id === '' || !this.is_valid_id(id)) {
                const err_msg = `Cannot delete_by_id. Invalid id param.`;
                throw urn_exc.create('DEL_BY_ID_INVALID_ID', err_msg);
            }
            const mon_delete_res = yield this._raw.findOneAndDelete({ _id: id });
            if (typeof mon_delete_res !== 'object' || mon_delete_res === null) {
                throw urn_exc.create_not_found('DEL_BY_ID_NOT_FOUND', `Cannot delete_by_id. Record not found.`);
            }
            return _clean_atom(this.atom_name, mon_delete_res.toObject());
        });
    }
    is_valid_id(id) {
        return _is_valid_id(id);
    }
};
MongooseRelation = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], MongooseRelation);
exports.MongooseRelation = MongooseRelation;
function _is_valid_id(id) {
    return mongoose_1.default.Types.ObjectId.isValid(id);
}
function _generate_subatomkey_populate_obj(atom_name, subatom_key, depth, depth_query) {
    const subatom_name = urn_atm.get_subatom_name(atom_name, subatom_key);
    let populate_object = { path: subatom_key, model: subatom_name };
    if (depth_query) {
        populate_object.match = depth_query;
    }
    const subsubatom_keys = urn_atm.get_bond_keys(subatom_name);
    if (subsubatom_keys.size === 0 || depth == 0)
        return populate_object;
    const subpops = [];
    for (const subsubkey of subsubatom_keys) {
        subpops.push(_generate_subatomkey_populate_obj(subatom_name, subsubkey, depth - 1, depth_query));
    }
    populate_object = Object.assign(Object.assign({}, populate_object), { populate: subpops });
    return populate_object;
}
function _generate_populate_obj(atom_name, depth, depth_query) {
    const subatom_keys = urn_atm.get_bond_keys(atom_name);
    const populate_object = [];
    if (depth && depth > 0 && depth <= defaults_1.core_config.max_query_depth_allowed && subatom_keys.size) {
        for (const k of subatom_keys) {
            populate_object.push(_generate_subatomkey_populate_obj(atom_name, k, depth - 1, depth_query));
        }
    }
    return populate_object;
}
function _clean_atom(atom_name, atom) {
    if (atom._id) {
        atom._id = atom._id.toString();
    }
    if (urn_lib_1.urn_util.object.has_key(atom, '__v')) {
        delete atom.__v;
    }
    const subatom_keys = urn_atm.get_bond_keys(atom_name);
    if (subatom_keys.size > 0) {
        for (const subkey of subatom_keys) {
            const subatom_name = urn_atm.get_subatom_name(atom_name, subkey);
            const prop = atom[subkey];
            if (atom[subkey]) {
                if (Array.isArray(prop)) {
                    for (let i = 0; i < prop.length; i++) {
                        if (_is_valid_id(prop[i])) {
                            prop[i] = prop[i].toString();
                        }
                        else if (typeof prop[i] === 'object') {
                            prop[i] = _clean_molecule(subatom_name, prop[i]);
                        }
                    }
                }
                else if (_is_valid_id(prop)) {
                    atom[subkey] = prop.toString();
                }
                else if (typeof prop === 'object') {
                    atom[subkey] = _clean_molecule(subatom_name, prop);
                }
            }
        }
    }
    return atom;
}
function _clean_molecule(atom_name, molecule) {
    if (molecule._id) {
        molecule._id = molecule._id.toString();
    }
    if (urn_lib_1.urn_util.object.has_key(molecule, '__v')) {
        delete molecule.__v;
    }
    const subatom_keys = urn_atm.get_bond_keys(atom_name);
    if (subatom_keys.size > 0) {
        for (const subkey of subatom_keys) {
            const subatom_name = urn_atm.get_subatom_name(atom_name, subkey);
            let prop = molecule[subkey];
            if (prop) {
                if (Array.isArray(prop)) {
                    for (let i = 0; i < prop.length; i++) {
                        if (_is_valid_id(prop[i])) {
                            prop[i] = prop[i].toString();
                        }
                        else if (typeof prop[i] === 'object') {
                            prop[i] = _clean_molecule(subatom_name, prop[i]);
                        }
                    }
                }
                else if (_is_valid_id(prop)) {
                    prop = prop.toString();
                }
                else if (typeof prop === 'object') {
                    prop = _clean_molecule(subatom_name, prop);
                }
            }
        }
    }
    return molecule;
}
function create(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create MongooseRelation`);
    return new MongooseRelation(atom_name);
}
exports.create = create;
//# sourceMappingURL=relation.js.map