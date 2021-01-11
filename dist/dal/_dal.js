"use strict";
/**
 * Abstract Class for Data Access Layer
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
exports.create = exports.DAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_atm = __importStar(require("../atm/"));
const urn_rel = __importStar(require("../rel/"));
const urn_validators = __importStar(require("../vali/"));
const defaults_1 = require("../config/defaults");
const book_1 = require("../book");
const atom_1 = require("../typ/atom");
const urn_exc = urn_lib_1.urn_exception.init('DAL', 'Abstract DAL');
let DAL = class DAL {
    constructor(atom_name) {
        this.atom_name = atom_name;
        switch (defaults_1.core_config.db_type) {
            case 'mongo': {
                this._db_relation = urn_rel.mongo.create(this.atom_name);
                this._db_trash_relation = urn_rel.mongo.trash_create(this.atom_name);
                break;
            }
            default: {
                const err_msg = `The Database type in the configuration data is invalid.`;
                throw urn_exc.create('INVALID_DB_TYPE', err_msg);
                break;
            }
        }
    }
    validate(molecule, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            return urn_atm.validate(this.atom_name, molecule, depth);
        });
    }
    select(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const atom_array = yield this._select(query, options);
            for (let i = 0; i < atom_array.length; i++) {
                const depth = (options && options.depth) ? options.depth : undefined;
                atom_array[i] = yield this.validate(atom_array[i], depth);
            }
            return atom_array;
        });
    }
    select_by_id(id, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            let db_record = yield this._select_by_id(id, depth);
            db_record = yield this.validate(db_record, depth);
            return db_record;
        });
    }
    select_one(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let db_record = yield this._select_one(query, options);
            const depth = (options && options.depth) ? options.depth : undefined;
            db_record = yield this.validate(db_record, depth);
            return db_record;
        });
    }
    insert_one(atom_shape) {
        return __awaiter(this, void 0, void 0, function* () {
            atom_shape = yield urn_atm.encrypt_properties(this.atom_name, atom_shape);
            yield this._check_unique(atom_shape);
            let db_record = yield this._insert_one(atom_shape);
            db_record = yield this.validate(db_record);
            return db_record;
        });
    }
    alter_by_id(id, partial_atom) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._check_unique(partial_atom, id);
            let db_record = yield this._alter_by_id(id, partial_atom);
            db_record = yield this.validate(db_record);
            return db_record;
        });
    }
    alter_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            let db_record = yield this.alter_by_id(atom._id, atom);
            db_record = yield this.validate(db_record);
            return db_record;
        });
    }
    delete_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db_res_delete = yield this._delete_by_id(id);
            if (db_res_delete && this._db_trash_relation) {
                db_res_delete._deleted_from = db_res_delete._id;
                return yield this.trash_insert_one(db_res_delete);
            }
            const db_record = db_res_delete;
            return db_record;
        });
    }
    delete_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            const db_record = yield this.delete_by_id(atom._id);
            return db_record;
        });
    }
    trash_select(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._select(query, options, true);
        });
    }
    trash_select_by_id(id, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._select_by_id(id, depth, true);
        });
    }
    trash_select_one(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._select_one(query, options, true);
        });
    }
    trash_insert_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._insert_one(atom, true);
        });
    }
    trash_delete_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete_by_id(atom._id, true);
        });
    }
    trash_delete_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete_by_id(id, true);
        });
    }
    _select(query, options, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && this._db_trash_relation === null) {
                const err_msg = `Cannot _select [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('SELECT_IN_TRASH_NO_TRASH', err_msg);
            }
            urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            const db_res_select = yield _relation.select(query, options);
            const atom_array = [];
            for (const db_record of db_res_select) {
                atom_array.push(db_record);
            }
            return atom_array;
        });
    }
    _select_by_id(id, depth, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && this._db_trash_relation === null) {
                const err_msg = `Cannot _select_by_id [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('SELECT_ID_TRASH_NOT_FOUND', err_msg);
            }
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            if (!this._db_relation.is_valid_id(id)) {
                throw urn_exc.create('SELECT_ID_INVALID_ID', `Cannot _select_by_id. Invalid argument id.`);
            }
            const db_res_select_by_id = yield _relation.select_by_id(id, depth);
            return db_res_select_by_id;
        });
    }
    _select_one(query, options, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && this._db_trash_relation === null) {
                const err_msg = `Cannot _select_one [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('SELECT_ONE_TRASH_NOT_FOUND', err_msg);
            }
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
            const db_res_select_one = yield _relation.select_one(query, options);
            return db_res_select_one;
        });
    }
    _insert_one(atom_shape, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && this._db_trash_relation === null) {
                const err_msg = `Cannot _insert_one [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('INS_ONE_TRASH_NOT_FOUND', err_msg);
            }
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            const db_res_insert = yield _relation.insert_one(atom_shape);
            return db_res_insert;
        });
    }
    _alter_by_id(id, partial_atom, in_trash = false, fix = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && this._db_trash_relation === null) {
                const err_msg = `Cannot _alter_by_id [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('ALTER_BY_ID_TRASH_NOT_FOUND', err_msg);
            }
            if (fix === true) {
                partial_atom = yield this._encrypt_changed_properties(id, partial_atom);
            }
            urn_atm.validate_atom_partial(this.atom_name, partial_atom);
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            const db_res_insert = yield _relation.alter_by_id(id, partial_atom);
            return db_res_insert;
        });
    }
    _delete_by_id(id, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && !this._db_trash_relation) {
                const err_msg = `Cannot _delete_by_id [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('DEL_BY_ID_TRASH_NOT_FOUND', err_msg);
            }
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            const db_res_delete = yield _relation.delete_by_id(id);
            return db_res_delete;
        });
    }
    _encrypt_changed_properties(id, atom) {
        return __awaiter(this, void 0, void 0, function* () {
            const atom_props = book_1.atom_book[this.atom_name]['properties'];
            const all_props = Object.assign(Object.assign(Object.assign({}, atom_1.atom_hard_properties), atom_1.atom_common_properties), atom_props);
            for (const k in atom) {
                const prop_def = all_props[k];
                if (prop_def && prop_def.type && prop_def.type === "ENCRYPTED" /* ENCRYPTED */) {
                    let value = atom[k];
                    if (value && typeof value === 'string' && (value.length !== 60 || value.startsWith('$2'))) {
                        value = yield urn_atm.encrypt_property(this.atom_name, k, value);
                    }
                    else {
                        const res_select = yield this._select_by_id(id);
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
    _check_unique(partial_atom, id) {
        return __awaiter(this, void 0, void 0, function* () {
            urn_atm.validate_atom_partial(this.atom_name, partial_atom);
            const $or = [];
            for (const k of urn_atm.get_unique_keys(this.atom_name)) {
                $or.push({ [k]: partial_atom[k] });
            }
            if ($or.length === 0) {
                return true;
            }
            let query = {};
            if (typeof id === 'string' && this._db_relation.is_valid_id(id)) {
                query = { $and: [{ $not: { _id: id } }, { $or: $or }] };
            }
            else {
                query = { $or: $or };
            }
            try {
                const res_select_one = yield this._select_one(query);
                const equal_values = new Set();
                for (const k of urn_atm.get_unique_keys(this.atom_name)) {
                    if (partial_atom[k] === res_select_one[k]) {
                        equal_values.add(k);
                    }
                }
                let err_msg = `Atom unique fields are already in the database.`;
                err_msg += ` Duplicate fields: ${urn_lib_1.urn_util.formatter.json_one_line(equal_values)}.`;
                throw urn_exc.create('CHECK_UNIQUE_DUPLICATE', err_msg);
            }
            catch (err) {
                if (!err.type || err.type !== "NOTFOUND" /* NOT_FOUND */) {
                    throw err;
                }
            }
            return true;
        });
    }
};
DAL = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], DAL);
exports.DAL = DAL;
// export type DalInstance = InstanceType<typeof DAL>;
function create(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create DAL [${atom_name}]`);
    return new DAL(atom_name);
}
exports.create = create;
//# sourceMappingURL=_dal.js.map