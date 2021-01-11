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
exports.create_abstract = exports.AbstractDAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('ABS_DAL', 'Abstract DAL');
const urn_validators = __importStar(require("../vali/"));
let AbstractDAL = class AbstractDAL {
    constructor(atom_name, _db_relation) {
        this.atom_name = atom_name;
        this._db_relation = _db_relation;
    }
    select(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
            return yield this._db_relation.select(query, options);
        });
    }
    select_by_id(id, depth) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._db_relation.is_valid_id(id)) {
                throw urn_exc.create('SELECT_BY_ID_INVALID_ID', `Cannot _select_by_id. Invalid argument id.`);
            }
            return yield this._db_relation.select_by_id(id, depth);
        });
    }
    select_one(query, options) {
        return __awaiter(this, void 0, void 0, function* () {
            urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
            return yield this._db_relation.select_one(query, options);
        });
    }
    insert_one(atom_shape) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._db_relation.insert_one(atom_shape);
        });
    }
    alter_by_id(id, partial_atom) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._db_relation.alter_by_id(id, partial_atom);
        });
    }
    delete_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._db_relation.delete_by_id(id);
        });
    }
};
AbstractDAL = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], AbstractDAL);
exports.AbstractDAL = AbstractDAL;
// export type DalInstance = InstanceType<typeof DAL>;
function create_abstract(atom_name, db_relation) {
    urn_lib_1.urn_log.fn_debug(`Create Abstract DAL [${atom_name}]`);
    return new AbstractDAL(atom_name, db_relation);
}
exports.create_abstract = create_abstract;
//# sourceMappingURL=abs.js.map