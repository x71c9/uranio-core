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
exports.DAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_rels = __importStar(require("../rel/"));
const urn_validators = __importStar(require("../vali/"));
const urn_exc = urn_lib_1.urn_exception.init('DAL', 'Abstract DAL');
let DAL = class DAL {
    constructor(db_type, atom_definition) {
        this.db_type = db_type;
        this.atom_definition = atom_definition;
        switch (this.db_type) {
            case 'mongo':
                this._db_relation = new urn_rels.mongo.MongooseRelation(this.atom_definition.name);
                this._db_trash_relation = new urn_rels.mongo.MongooseTrashRelation(this.atom_definition.name);
                break;
            default:
                this._db_relation = new urn_rels.mongo.MongooseRelation(this.atom_definition.name);
                this._db_trash_relation = new urn_rels.mongo.MongooseTrashRelation(this.atom_definition.name);
                break;
        }
    }
    find(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._find(filter, options);
        });
    }
    find_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._find_by_id(id);
        });
    }
    find_one(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._find_one(filter, options);
        });
    }
    insert_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._check_unique(atom);
            return yield this._insert_one(atom);
        });
    }
    alter_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._check_unique(atom);
            return yield this._alter_one(atom);
        });
    }
    delete_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            const db_res_delete = yield this._delete_one(atom);
            if (db_res_delete && this._db_trash_relation) {
                db_res_delete._deleted_from = db_res_delete._id;
                return yield this.trash_insert_one(db_res_delete);
            }
            return db_res_delete;
        });
    }
    trash_find(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._find(filter, options, true);
        });
    }
    trash_find_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._find_by_id(id, true);
        });
    }
    trash_find_one(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._find_one(filter, options, true);
        });
    }
    trash_insert_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._insert_one(atom, true);
        });
    }
    trash_update_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._alter_one(atom, true);
        });
    }
    trash_delete_one(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._delete_one(atom, true);
        });
    }
    _find(filter, options, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && this._db_trash_relation === null) {
                return [];
            }
            urn_validators.query.validate_filter_options_params(this.atom_definition.properties, filter, options);
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            const db_res_find = yield _relation.find(filter, options);
            const atom_array = db_res_find.reduce((result, db_record) => {
                result.push(this._create_atom(db_record));
                return result;
            }, []);
            return atom_array;
        });
    }
    _find_by_id(id, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && this._db_trash_relation === null) {
                const err_msg = `Cannot _find_by_id [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('FIND_ID_TRASH_NOT_FOUND', err_msg);
            }
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            if (!this._db_relation.is_valid_id(id)) {
                throw urn_exc.create('FIND_ID_INVALID_ID', `Cannot _find_by_id. Invalid argument id.`);
            }
            const db_res_find_by_id = yield _relation.find_by_id(id);
            return this._create_atom(db_res_find_by_id);
        });
    }
    _find_one(filter, options, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && this._db_trash_relation === null) {
                const err_msg = `Cannot _find_one [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('FIND_ONE_TRASH_NOT_FOUND', err_msg);
            }
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            urn_validators.query.validate_filter_options_params(this.atom_definition.properties, filter, options);
            const db_res_find_one = yield _relation.find_one(filter, options);
            return this._create_atom(db_res_find_one);
        });
    }
    _insert_one(atom, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && this._db_trash_relation === null) {
                const err_msg = `Cannot _insert_one [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('INS_ONE_TRASH_NOT_FOUND', err_msg);
            }
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            const db_res_insert = yield _relation.insert_one(atom.return());
            return this._create_atom(db_res_insert);
        });
    }
    _alter_one(atom, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && this._db_trash_relation === null) {
                const err_msg = `Cannot _alter_one [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('UPD_ONE_TRASH_NOT_FOUND', err_msg);
            }
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            const db_res_insert = yield _relation.alter_one(atom.return());
            return this._create_atom(db_res_insert);
        });
    }
    _delete_one(atom, in_trash = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (in_trash === true && !this._db_trash_relation) {
                const err_msg = `Cannot _delete_one [in_trash=true]. Trash DB not found.`;
                throw urn_exc.create('DEL_ONE_TRASH_NOT_FOUND', err_msg);
            }
            const _relation = (in_trash === true && this._db_trash_relation) ?
                this._db_trash_relation : this._db_relation;
            const db_res_insert = yield _relation.delete_one(atom.return());
            return this._create_atom(db_res_insert);
        });
    }
    _check_unique(atom) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = {};
            filter.$or = [];
            const model = atom.return();
            for (const k of atom.get_keys().unique) {
                const filter_object = {};
                filter_object[k] = model[k];
                filter.$or.push(filter_object);
            }
            try {
                const res_find_one = yield this._find_one(filter);
                const equal_values = new Set();
                const res_model = res_find_one.return();
                for (const k of atom.get_keys().unique) {
                    if (model[k] == res_model[k]) {
                        equal_values.add(k);
                    }
                }
                let err_msg = `Atom unique fields are already in the database.`;
                err_msg += ` Duplicate fields: ${urn_lib_1.urn_util.formatter.json_one_line(equal_values)}.`;
                throw urn_exc.create('CHECK_UNIQUE_DUPLICATE', err_msg);
            }
            catch (err) {
                if (!err.type || err.type !== "notfound" /* NOT_FOUND */) {
                    throw err;
                }
            }
        });
    }
    _create_atom(resource) {
        return this.atom_definition.create(resource);
    }
};
DAL = __decorate([
    urn_lib_1.urn_log.decorators.debug_methods
], DAL);
exports.DAL = DAL;
//# sourceMappingURL=abstract.js.map