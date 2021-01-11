"use strict";
/**
 * Class for Validate Data Access Layer
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
exports.create_validate = exports.ValidateDAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('VAL_DAL', 'ValidateDAL');
const urn_atm = __importStar(require("../atm/"));
const urn_rel = __importStar(require("../rel/"));
const defaults_1 = require("../conf/defaults");
const basic_1 = require("./basic");
let ValidateDAL = class ValidateDAL extends basic_1.BasicDAL {
    constructor(atom_name) {
        let db_relation;
        switch (defaults_1.core_config.db_type) {
            case 'mongo': {
                db_relation = urn_rel.mongo.create(atom_name);
                break;
            }
            default: {
                const err_msg = `The Database type in the configuration data is invalid.`;
                throw urn_exc.create('INVALID_DB_TYPE', err_msg);
                break;
            }
        }
        super(atom_name, db_relation);
    }
    select(query, options) {
        const _super = Object.create(null, {
            select: { get: () => super.select }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const atom_array = yield _super.select.call(this, query, options);
            for (let i = 0; i < atom_array.length; i++) {
                const depth = (options && options.depth) ? options.depth : undefined;
                atom_array[i] = yield this.validate(atom_array[i], depth);
            }
            return atom_array;
        });
    }
    select_by_id(id, depth) {
        const _super = Object.create(null, {
            select_by_id: { get: () => super.select_by_id }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let db_record = yield _super.select_by_id.call(this, id, depth);
            db_record = yield this.validate(db_record, depth);
            return db_record;
        });
    }
    select_one(query, options) {
        const _super = Object.create(null, {
            select_one: { get: () => super.select_one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let db_record = yield _super.select_one.call(this, query, options);
            const depth = (options && options.depth) ? options.depth : undefined;
            db_record = yield this.validate(db_record, depth);
            return db_record;
        });
    }
    insert_one(atom_shape) {
        const _super = Object.create(null, {
            insert_one: { get: () => super.insert_one }
        });
        return __awaiter(this, void 0, void 0, function* () {
            urn_atm.validate_atom_shape(this.atom_name, atom_shape);
            yield this._check_unique(atom_shape);
            let db_record = yield _super.insert_one.call(this, atom_shape);
            db_record = yield this.validate(db_record);
            return db_record;
        });
    }
    alter_by_id(id, partial_atom) {
        const _super = Object.create(null, {
            alter_by_id: { get: () => super.alter_by_id }
        });
        return __awaiter(this, void 0, void 0, function* () {
            urn_atm.validate_atom_partial(this.atom_name, partial_atom);
            yield this._check_unique(partial_atom, id);
            let db_record = yield _super.alter_by_id.call(this, id, partial_atom);
            db_record = yield this.validate(db_record);
            return db_record;
        });
    }
    delete_by_id(id) {
        const _super = Object.create(null, {
            delete_by_id: { get: () => super.delete_by_id }
        });
        return __awaiter(this, void 0, void 0, function* () {
            let db_record = yield _super.delete_by_id.call(this, id);
            db_record = yield this.validate(db_record);
            return db_record;
        });
    }
    _check_unique(partial_atom, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const $or = [];
            const unique_keys = urn_atm.get_unique_keys(this.atom_name);
            for (const k of unique_keys) {
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
                const res_select_one = yield this.select_one(query);
                const equal_values = new Set();
                for (const k of unique_keys) {
                    if (partial_atom[k] === res_select_one[k]) {
                        equal_values.add(k);
                    }
                }
                let err_msg = `Atom unique fields are already in the database.`;
                err_msg += ` Duplicate fields: ${urn_lib_1.urn_util.formatter.json_one_line(equal_values)}.`;
                throw urn_exc.create('CHECK_UNIQUE_DUPLICATE', err_msg);
            }
            catch (err) {
                if (err.type && err.type === "NOTFOUND" /* NOT_FOUND */) {
                    return true;
                }
                throw err;
            }
            return true;
        });
    }
    validate(molecule, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            return urn_atm.validate(this.atom_name, molecule, depth);
        });
    }
};
ValidateDAL = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], ValidateDAL);
exports.ValidateDAL = ValidateDAL;
function create_validate(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create ValidateDAL [${atom_name}]`);
    return new ValidateDAL(atom_name);
}
exports.create_validate = create_validate;
//# sourceMappingURL=validate.js.map