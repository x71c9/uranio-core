"use strict";
/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.MongooseRelation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uranio_utils_1 = require("uranio-utils");
const conf = __importStar(require("../../conf/server"));
const atm_keys = __importStar(require("../../atm/keys"));
const atm_util = __importStar(require("../../atm/util"));
const models_1 = require("./models");
const urn_exc = uranio_utils_1.urn_exception.init('REL_MONGO', 'Mongoose Relation');
/**
 * Mongoose Relation class
 */
let MongooseRelation = class MongooseRelation {
    constructor(atom_name) {
        this.atom_name = atom_name;
        this._conn_name = this._get_conn_name();
        // const models_map = models_by_connection.get(this._conn_name);
        // if(!models_map){
        //   const err_msg = `Cannot find models for connection [${this._conn_name}]`;
        //   throw urn_exc.create('MODELS_NOT_FOUND', err_msg);
        // }
        // const model = models_map.get(this.atom_name);
        // if(!model){
        //   let err_msg = `Cannot find model for atom [${this.atom_name}]`;
        //   err_msg += ` and connection [${this._conn_name}]`;
        //   throw urn_exc.create('MODEL_NOT_FOUND', err_msg);
        // }
        // this._raw = model;
        this._raw = (0, models_1.get_model)(this._conn_name, this.atom_name);
    }
    _get_conn_name() {
        return 'main';
    }
    async select(query, options) {
        let mon_find_res = [];
        if (options) {
            if (options.depth && Number(options.depth) > 0) {
                const populate_object = _generate_populate_obj(this.atom_name, Number(options.depth), options.depth_query);
                mon_find_res = await this._raw.find(query, null, options)
                    .populate(populate_object).lean();
            }
            else {
                mon_find_res = await this._raw.find(query, null, options).lean();
            }
        }
        else {
            mon_find_res = await this._raw.find(query).lean();
        }
        return mon_find_res.map((mon_doc) => {
            return _clean_molecule(this.atom_name, mon_doc);
        });
    }
    async select_by_id(id, options) {
        let mon_find_by_id_res;
        if (options && options.depth && Number(options.depth) > 0) {
            const populate_object = _generate_populate_obj(this.atom_name, Number(options.depth), options.depth_query);
            mon_find_by_id_res = await this._raw.findById(id)
                .populate(populate_object).lean();
        }
        else {
            mon_find_by_id_res = await this._raw.findById(id).lean();
        }
        if (mon_find_by_id_res === null) {
            throw urn_exc.create_not_found('FIND_ID_NOT_FOUND', `Record not found.`);
        }
        return _clean_molecule(this.atom_name, mon_find_by_id_res);
    }
    async select_one(query, options) {
        let mon_find_one_res;
        if (options && options.depth && Number(options.depth) > 0) {
            const populate_object = _generate_populate_obj(this.atom_name, Number(options.depth), options.depth_query);
            mon_find_one_res = await this._raw.findOne(query).sort(options.sort)
                .populate(populate_object).lean();
        }
        else {
            mon_find_one_res = await this._raw.findOne(query).lean();
        }
        if (mon_find_one_res === null) {
            throw urn_exc.create_not_found('FIND_ONE_NOT_FOUND', `Record not found.`);
        }
        return _clean_molecule(this.atom_name, mon_find_one_res);
    }
    async count(query) {
        const mon_count_res = await this._raw.countDocuments(query).lean();
        return mon_count_res;
    }
    async insert_one(atom_shape) {
        if (uranio_utils_1.urn_util.object.has_key(atom_shape, '_id')) {
            delete atom_shape._id;
        }
        const mon_model = new this._raw(atom_shape);
        const mon_res_doc = await mon_model.save();
        const str_id = mon_res_doc._id.toString();
        const mon_obj = mon_res_doc.toObject();
        mon_obj._id = str_id;
        return _clean_atom(this.atom_name, mon_obj);
    }
    async alter_by_id(id, partial_atom, options) {
        if (typeof id !== 'string' || id === '' || !this.is_valid_id(id)) {
            const err_msg = `Cannot alter_by_id. Invalid id param.`;
            throw urn_exc.create_invalid_request('ALTER_BY_ID_INVALID_ID', err_msg);
        }
        const $unset = _find_unsets(this.atom_name, partial_atom);
        partial_atom = _clean_unset(this.atom_name, partial_atom);
        const update = {
            $set: partial_atom,
            $unset: $unset
        };
        const default_options = { new: true, lean: true };
        let current_options = default_options;
        let mon_update_res;
        if (options) {
            if (options.limit) {
                delete options.limit;
            }
            current_options = { ...default_options, ...options };
            if (options.depth && Number(options.depth) > 0) {
                const populate_object = _generate_populate_obj(this.atom_name, Number(options.depth), options.depth_query);
                mon_update_res =
                    await this._raw.findByIdAndUpdate({ _id: id }, update, current_options)
                        .populate(populate_object);
            }
            else {
                mon_update_res =
                    await this._raw.findByIdAndUpdate({ _id: id }, update, current_options);
            }
        }
        else {
            mon_update_res =
                await this._raw.findByIdAndUpdate({ _id: id }, update, default_options);
        }
        if (mon_update_res === null) {
            throw urn_exc.create_not_found('ALTER_BY_ID_NOT_FOUND', `Cannot alter_by_id. Record not found.`);
        }
        return _clean_molecule(this.atom_name, mon_update_res);
    }
    async replace_by_id(id, atom) {
        if (typeof id !== 'string' || id === '' || !this.is_valid_id(id)) {
            const err_msg = `Cannot replace_by_id. Invalid id param.`;
            throw urn_exc.create('REPLACE_BY_ID_INVALID_ID', err_msg);
        }
        const mon_update_res = await this._raw.findByIdAndUpdate({ _id: id }, atom, { new: true, lean: true, overwrite: true });
        if (mon_update_res === null) {
            throw urn_exc.create_not_found('REPLACE_BY_ID_NOT_FOUND', `Cannot replace_by_id. Record not found.`);
        }
        const cleaned = _clean_atom(this.atom_name, mon_update_res);
        return cleaned;
    }
    async delete_by_id(id) {
        if (typeof id !== 'string' || id === '' || !this.is_valid_id(id)) {
            const err_msg = `Cannot delete_by_id. Invalid id param.`;
            throw urn_exc.create_invalid_request('DEL_BY_ID_INVALID_ID', err_msg);
        }
        const mon_delete_res = await this._raw.findOneAndDelete({ _id: id });
        if (typeof mon_delete_res !== 'object' || mon_delete_res === null) {
            throw urn_exc.create_not_found('DEL_BY_ID_NOT_FOUND', `Cannot delete_by_id. Record not found.`);
        }
        return _clean_atom(this.atom_name, mon_delete_res.toObject());
    }
    async alter_multiple(ids, partial_atom) {
        let delete_all = false;
        if (ids.length === 1 && ids[0] === '*') {
            delete_all = true;
        }
        if (delete_all === false) {
            for (const id of ids) {
                if (typeof id !== 'string' || id === '' || !this.is_valid_id(id)) {
                    const err_msg = `Cannot alter_multiple. Invalid id.`;
                    throw urn_exc.create_invalid_request('ALTER_MULTIPLE_INVALID_ID', err_msg);
                }
            }
        }
        const $unset = _find_unsets(this.atom_name, partial_atom);
        partial_atom = _clean_unset(this.atom_name, partial_atom);
        const update = {
            $set: partial_atom,
            $unset: $unset
        };
        const mongo_query_ids = (delete_all === true) ? {} : { _id: { $in: ids } };
        const mon_update_res = await this._raw.updateMany(mongo_query_ids, update, { new: true, lean: true }); // Return a schema.Query with how many records were updated.
        if (mon_update_res === null) {
            throw urn_exc.create_not_found('ALTER_MULTIPLE_ID_NOT_FOUND', `Cannot alter_multiple. Records not found.`);
        }
        return await this.select(mongo_query_ids);
    }
    async insert_multiple(atom_shapes, skip_on_error = false) {
        const shapes_no_id = [];
        for (const atom_shape of atom_shapes) {
            if (uranio_utils_1.urn_util.object.has_key(atom_shape, '_id')) {
                delete atom_shape._id;
            }
            shapes_no_id.push(atom_shape);
        }
        const mon_insert_many_res = await this._raw.insertMany(shapes_no_id, { lean: true, ordered: (!skip_on_error) });
        if (!Array.isArray(mon_insert_many_res)) {
            throw urn_exc.create('INSERT_MULTIPLE_FAILED', `Cannot insert_multiple.`);
        }
        const string_id_atoms = [];
        for (const db_atom of mon_insert_many_res) {
            const clean_atom = {
                ...db_atom.toObject()
            };
            clean_atom._id = db_atom._id.toString();
            string_id_atoms.push(clean_atom);
        }
        return _clean_atoms(this.atom_name, string_id_atoms);
    }
    async delete_multiple(ids) {
        let delete_all = false;
        if (ids.length === 1 && ids[0] === '*') {
            delete_all = true;
        }
        if (delete_all === false) {
            for (const id of ids) {
                if (typeof id !== 'string' || id === '' || !this.is_valid_id(id)) {
                    const err_msg = `Cannot delete_by_id. Invalid id param.`;
                    throw urn_exc.create_invalid_request('DEL_BY_ID_INVALID_ID', err_msg);
                }
            }
        }
        const mongo_query = (delete_all === true) ? {} : { _id: { $in: ids } };
        const almost_deleted_docs = await this.select(mongo_query);
        // Return a schema.Query with how many records were deleted.
        const mon_delete_res = await this._raw.deleteMany(mongo_query);
        if (mon_delete_res === null) {
            throw urn_exc.create_not_found('DEL_MULTIPLE_NOT_FOUND', `Cannot delete_multiple.`);
        }
        // const cleaned_atoms:schema.Atom<A>[] = [];
        // for(const db_atom of mon_delete_res){
        //   cleaned_atoms.push(_clean_atom(this.atom_name, db_atom.toObject() as schema.Atom<A>));
        // }
        // return cleaned_atoms;
        return almost_deleted_docs;
    }
    is_valid_id(id) {
        return _is_valid_id(id);
    }
};
MongooseRelation = __decorate([
    uranio_utils_1.urn_log.util.decorators.debug_constructor,
    uranio_utils_1.urn_log.util.decorators.debug_methods
], MongooseRelation);
exports.MongooseRelation = MongooseRelation;
function _is_valid_id(id) {
    return mongoose_1.default.Types.ObjectId.isValid(id);
}
function _find_unsets(atom_name, partial_atom) {
    const unsets = {};
    const type_atom_props = atm_keys.get_bond(atom_name);
    for (const [prop, value] of Object.entries(partial_atom)) {
        if (type_atom_props.has(prop) && value === '') {
            unsets[prop] = 1;
        }
    }
    return unsets;
}
function _clean_unset(atom_name, partial_atom) {
    const type_atom_props = atm_keys.get_bond(atom_name);
    for (const [prop, value] of Object.entries(partial_atom)) {
        if (type_atom_props.has(prop) && value === '') {
            delete partial_atom[prop];
        }
    }
    return partial_atom;
}
function _generate_subatomkey_populate_obj(atom_name, subatom_key, depth, depth_query) {
    const subatom_name = atm_util.get_subatom_name(atom_name, subatom_key);
    let populate_object = { path: subatom_key, model: subatom_name };
    if (depth_query) {
        populate_object.match = depth_query;
    }
    const subsubatom_keys = atm_keys.get_bond(subatom_name);
    if (subsubatom_keys.size === 0 || depth == 0)
        return populate_object;
    const subpops = [];
    for (const subsubkey of subsubatom_keys) {
        subpops.push(_generate_subatomkey_populate_obj(subatom_name, subsubkey, depth - 1, depth_query));
    }
    populate_object = {
        ...populate_object,
        populate: subpops
    };
    return populate_object;
}
function _generate_populate_obj(atom_name, depth, depth_query) {
    const subatom_keys = atm_keys.get_bond(atom_name);
    const populate_object = [];
    if (depth && depth > 0 && depth <= conf.get(`max_query_depth_allowed`) && subatom_keys.size) {
        for (const k of subatom_keys) {
            populate_object.push(_generate_subatomkey_populate_obj(atom_name, k, depth - 1, depth_query));
        }
    }
    return populate_object;
}
function _clean_atoms(atom_name, atoms) {
    const cleaned_atoms = [];
    for (const atom of atoms) {
        cleaned_atoms.push(_clean_atom(atom_name, atom));
    }
    return cleaned_atoms;
}
function _clean_atom(atom_name, atom) {
    if (atom._id) {
        atom._id = atom._id.toString();
    }
    if (uranio_utils_1.urn_util.object.has_key(atom, '__v')) {
        delete atom.__v;
    }
    const subatom_keys = atm_keys.get_bond(atom_name);
    if (subatom_keys.size > 0) {
        for (const subkey of subatom_keys) {
            const subatom_name = atm_util.get_subatom_name(atom_name, subkey);
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
                    atom[subkey] = String(prop);
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
    if (uranio_utils_1.urn_util.object.has_key(molecule, '__v')) {
        delete molecule.__v;
    }
    const subatom_keys = atm_keys.get_bond(atom_name);
    if (subatom_keys.size > 0) {
        for (const subkey of subatom_keys) {
            const subatom_name = atm_util.get_subatom_name(atom_name, subkey);
            const prop = molecule[subkey];
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
                    molecule[subkey] = String(prop);
                }
                else if (typeof prop === 'object') {
                    molecule[subkey] = _clean_molecule(subatom_name, prop);
                }
            }
        }
    }
    return molecule;
}
function create(atom_name) {
    uranio_utils_1.urn_log.trace(`Create MongooseRelation`);
    return new MongooseRelation(atom_name);
}
exports.create = create;
//# sourceMappingURL=relation.js.map