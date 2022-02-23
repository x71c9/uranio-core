"use strict";
/**
 * Class for Validate Data Access Layer
 *
 * This class will validate all schema.Atom before and after saving to the db.
 * If the Atoms are not valid it will throw Exceptions.
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
exports.create_validate = exports.ValidateDAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('VAL_DAL', 'ValidateDAL');
const atm_validate = __importStar(require("../atm/validate"));
const atm_keys = __importStar(require("../atm/keys"));
const book = __importStar(require("../book/server"));
const types = __importStar(require("../srv/types"));
const server_1 = require("../stc/server");
const rel_1 = require("./rel");
let ValidateDAL = class ValidateDAL extends rel_1.RelationDAL {
    async select(query, options) {
        const atom_array = await super.select(query, options);
        for (let i = 0; i < atom_array.length; i++) {
            const depth = (options && options.depth) ? options.depth : undefined;
            atom_array[i] = await this.validate(atom_array[i], depth);
        }
        return atom_array;
    }
    async select_by_id(id, options) {
        if (!this._db_relation.is_valid_id(id)) {
            throw urn_exc.create_invalid_request('INVALID_ID', `Invalid request \`_id\`.`);
        }
        let db_record = await super.select_by_id(id, options);
        const depth = (options && options.depth) ? options.depth : undefined;
        db_record = await this.validate(db_record, depth);
        return db_record;
    }
    async select_one(query, options) {
        if (urn_lib_1.urn_util.object.has_key(query, '_id') && query._id) {
            return this.select_by_id(query._id, options);
        }
        let db_record = await super.select_one(query, options);
        const depth = (options && options.depth) ? options.depth : undefined;
        db_record = await this.validate(db_record, depth);
        return db_record;
    }
    async insert_one(atom_shape) {
        atm_validate.atom_shape(this.atom_name, atom_shape);
        _check_ids(this.atom_name, atom_shape, this._db_relation.is_valid_id);
        await this._check_unique(atom_shape);
        let db_record = await super.insert_one(atom_shape);
        db_record = await this.validate(db_record);
        return db_record;
    }
    async alter_by_id(id, partial_atom) {
        atm_validate.atom_partial(this.atom_name, partial_atom);
        _check_ids(this.atom_name, partial_atom, this._db_relation.is_valid_id);
        await this._check_unique(partial_atom, id);
        let db_record = await super.alter_by_id(id, partial_atom);
        db_record = await this.validate(db_record);
        return db_record;
    }
    async delete_by_id(id) {
        let db_record = await super.delete_by_id(id);
        db_record = await this.validate(db_record);
        return db_record;
    }
    // public async select_multiple<D extends schema.Depth>(ids:string[], options?:schema.Query.Options<A,D>)
    //     :Promise<schema.Molecule<A,D>[]>{
    //   return await this.select({_id: {$in: ids}} as schema.Query<A>, options);
    // }
    async alter_multiple(ids, partial_atom) {
        atm_validate.atom_partial(this.atom_name, partial_atom);
        _check_ids(this.atom_name, partial_atom, this._db_relation.is_valid_id);
        await this._check_unique_multiple_ids(partial_atom, ids);
        const db_records = await super.alter_multiple(ids, partial_atom);
        const validated_db_records = [];
        for (const db_record of db_records) {
            const validated_db_record = await this.validate(db_record);
            validated_db_records.push(validated_db_record);
        }
        return validated_db_records;
    }
    async insert_multiple(atom_shapes) {
        for (const atom_shape of atom_shapes) {
            atm_validate.atom_shape(this.atom_name, atom_shape);
            _check_ids(this.atom_name, atom_shape, this._db_relation.is_valid_id);
        }
        await this._check_unique_multiple(atom_shapes);
        const db_records = await super.insert_multiple(atom_shapes);
        const validated_db_records = [];
        for (const db_record of db_records) {
            const validated_db_record = await this.validate(db_record);
            validated_db_records.push(validated_db_record);
        }
        return validated_db_records;
    }
    async delete_multiple(ids) {
        const db_records = await super.delete_multiple(ids);
        const validated_db_records = [];
        for (const db_record of db_records) {
            const validated_db_record = await this.validate(db_record);
            validated_db_records.push(validated_db_record);
        }
        return validated_db_records;
    }
    async _check_unique_multiple(partial_atoms) {
        const $or = [];
        const unique_keys = atm_keys.get_unique(this.atom_name);
        for (const k of unique_keys) {
            for (const partial_atom of partial_atoms) {
                $or.push({ [k]: partial_atom[k] });
            }
        }
        if ($or.length === 0) {
            return true;
        }
        let query = {};
        query = { $or: $or };
        try {
            const res_select_one = await this.select_one(query);
            const equal_values = {};
            for (const partial_atom of partial_atoms) {
                for (const k of unique_keys) {
                    if (partial_atom[k] === res_select_one[k]) {
                        equal_values[k] = res_select_one[k];
                    }
                }
            }
            let err_msg = `schema.Atom unique fields are already in the database.`;
            err_msg += ` Duplicate fields: ${urn_lib_1.urn_util.json.safe_stringify_oneline(equal_values)}.`;
            throw urn_exc.create_invalid_request('CHECK_UNIQUE_DUPLICATE', err_msg);
        }
        catch (e) {
            const err = e;
            if (err.type && err.type === urn_lib_1.urn_exception.ExceptionType.NOT_FOUND) {
                return true;
            }
            throw err;
        }
        // return true;
    }
    async _check_unique_multiple_ids(partial_atom, ids) {
        const $or = [];
        const unique_keys = atm_keys.get_unique(this.atom_name);
        for (const k of unique_keys) {
            $or.push({ [k]: partial_atom[k] });
        }
        if ($or.length === 0) {
            return true;
        }
        let query = {};
        if (!Array.isArray(ids)) {
            throw urn_exc.create_invalid_request(`INVALID_IDs`, `Invalid \`ids\` parameters.`);
        }
        for (const id of ids) {
            if (!this._db_relation.is_valid_id(id)) {
                throw urn_exc.create_invalid_request(`INVALID_ID`, `Invalid _id.`);
            }
        }
        query = { $and: [{ _id: { $in: ids } }, { $or: $or }] };
        try {
            const res_select_one = await this.select_one(query);
            const equal_values = new Set();
            for (const k of unique_keys) {
                if (partial_atom[k] === res_select_one[k]) {
                    equal_values.add(k);
                }
            }
            let err_msg = `schema.Atom unique fields are already in the database.`;
            err_msg += ` Duplicate fields: ${urn_lib_1.urn_util.json.safe_stringify_oneline(equal_values)}.`;
            throw urn_exc.create_invalid_request('CHECK_UNIQUE_DUPLICATE', err_msg);
        }
        catch (e) {
            const err = e;
            if (err.type && err.type === urn_lib_1.urn_exception.ExceptionType.NOT_FOUND) {
                return true;
            }
            throw err;
        }
        // return true;
    }
    async _check_unique(partial_atom, id) {
        const $or = [];
        const unique_keys = atm_keys.get_unique(this.atom_name);
        for (const k of unique_keys) {
            $or.push({ [k]: partial_atom[k] });
        }
        if ($or.length === 0) {
            return true;
        }
        let query = {};
        if (typeof id === 'string' && this._db_relation.is_valid_id(id)) {
            query = { $and: [{ _id: { $ne: id } }, { $or: $or }] };
        }
        else {
            query = { $or: $or };
        }
        try {
            const res_select_one = await this.select_one(query);
            const equal_values = new Set();
            for (const k of unique_keys) {
                if (partial_atom[k] === res_select_one[k]) {
                    equal_values.add(k);
                }
            }
            let err_msg = `schema.Atom unique fields are already in the database.`;
            err_msg += ` Duplicate fields: ${urn_lib_1.urn_util.json.safe_stringify_oneline(equal_values)}.`;
            throw urn_exc.create_invalid_request('CHECK_UNIQUE_DUPLICATE', err_msg);
        }
        catch (e) {
            const err = e;
            if (err.type && err.type === urn_lib_1.urn_exception.ExceptionType.NOT_FOUND) {
                return true;
            }
            throw err;
        }
        // return true;
    }
    async validate(molecule, depth) {
        return atm_validate.any(this.atom_name, molecule, depth);
    }
};
ValidateDAL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], ValidateDAL);
exports.ValidateDAL = ValidateDAL;
function _check_ids(atom_name, partial_atom, is_valid_id) {
    const props = book.get_custom_property_definitions(atom_name);
    let k;
    for (k in partial_atom) {
        let prop_def = undefined;
        if (urn_lib_1.urn_util.object.has_key(server_1.atom_hard_properties, k)) {
            prop_def = server_1.atom_hard_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(server_1.atom_common_properties, k)) {
            prop_def = server_1.atom_common_properties[k];
        }
        else if (urn_lib_1.urn_util.object.has_key(props, k)) {
            prop_def = props[k];
        }
        if (!prop_def) {
            const err_msg = `schema.Atom property definition missing for atom \`${atom_name}\` property \`${k}\``;
            throw urn_exc.create("CORRECT_TYPE_MISSING_ATM_PROP_DEFINITION", err_msg);
        }
        if (prop_def.type === types.PropertyType.ATOM) {
            const id = String(partial_atom[k]);
            if (prop_def.optional !== true || !_is_empty_id(id)) {
                _validate_id(id, is_valid_id, k);
            }
        }
        else if (prop_def.type === types.PropertyType.ATOM_ARRAY) {
            const ids = partial_atom[k];
            if (Array.isArray(ids)) {
                for (let i = 0; i < ids.length; i++) {
                    _validate_id(ids[i], is_valid_id, k);
                }
            }
        }
    }
    return true;
}
function _is_empty_id(id) {
    return (id === '');
}
function _validate_id(id, is_valid_id, key) {
    if (!is_valid_id(id)) {
        throw urn_exc.create_invalid_request('INVALID_ATOM_ID', `Invalid schema.Atom id \`${id}\` in property \`${key}\``);
    }
    return true;
}
function create_validate(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create ValidateDAL [${atom_name}]`);
    return new ValidateDAL(atom_name);
}
exports.create_validate = create_validate;
//# sourceMappingURL=validate.js.map