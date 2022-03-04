"use strict";
/**
 * Class for Basic Data Access Layer
 *
 * This class is a mirror of a Relation.
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_basic = exports.BasicDAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('BASIC_DAL', 'BasicDAL');
const urn_validators = __importStar(require("../val/server"));
let BasicDAL = class BasicDAL {
    constructor(atom_name, _db_relation) {
        this.atom_name = atom_name;
        this._db_relation = _db_relation;
    }
    async select(query, options) {
        urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
        const res_rel = await this._db_relation.select(query, options);
        return res_rel;
    }
    async select_by_id(id, options) {
        if (!this._db_relation.is_valid_id(id)) {
            const err_msg = `Cannot _select_by_id. Invalid argument id.`;
            throw urn_exc.create_invalid_request('SELECT_BY_ID_INVALID_ID', err_msg);
        }
        return await this._db_relation.select_by_id(id, options);
    }
    async select_one(query, options) {
        urn_validators.query.validate_filter_options_params(this.atom_name, query, options);
        return await this._db_relation.select_one(query, options);
    }
    async count(query) {
        urn_validators.query.validate_filter_options_params(this.atom_name, query);
        const res_rel = await this._db_relation.count(query);
        return res_rel;
    }
    async insert_one(atom_shape) {
        return await this._db_relation.insert_one(atom_shape);
    }
    async alter_by_id(id, partial_atom) {
        return await this._db_relation.alter_by_id(id, partial_atom);
    }
    async delete_by_id(id) {
        return await this._db_relation.delete_by_id(id);
    }
    async authorize(_action, _id) {
        return true;
    }
    // public async select_multiple<D extends schema.Depth>(ids:string[], options?:schema.Query.Options<A,D>)
    //     :Promise<schema.Molecule<A,D>[]>{
    //   return await this._db_relation.select({_id: {$in: ids}} as schema.Query<A>, options);
    // }
    async alter_multiple(ids, partial_atom) {
        return await this._db_relation.alter_multiple(ids, partial_atom);
    }
    async insert_multiple(atom_shapes) {
        return await this._db_relation.insert_multiple(atom_shapes);
    }
    async delete_multiple(ids) {
        return await this._db_relation.delete_multiple(ids);
    }
};
BasicDAL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], BasicDAL);
exports.BasicDAL = BasicDAL;
function create_basic(atom_name, db_relation) {
    urn_lib_1.urn_log.fn_debug(`Create BasicDAL [${atom_name}]`);
    return new BasicDAL(atom_name, db_relation);
}
exports.create_basic = create_basic;
//# sourceMappingURL=basic.js.map