"use strict";
/**
 * Class for Basic Business Logic Layer
 *
 * It is a mirror of a Data Access Layer.
 * The method _get_access_layer can be overwritten when extending the class.
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
exports.create = exports.BasicBLL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_dal = __importStar(require("../dal/server"));
let BasicBLL = class BasicBLL {
    constructor(atom_name, init_access_layer) {
        this.atom_name = atom_name;
        if (!init_access_layer) {
            this._al = urn_dal.create(atom_name);
        }
        else {
            this._al = init_access_layer();
        }
    }
    is_valid_id(_id) {
        return this._al.is_valid_id(_id);
    }
    async find(query, options) {
        return await this._al.select(query, options);
    }
    async find_by_id(id, options) {
        return await this._al.select_by_id(id, options);
    }
    async find_one(query, options) {
        return await this._al.select_one(query, options);
    }
    async count(query) {
        return await this._al.count(query);
    }
    async insert_new(atom_shape) {
        return await this._al.insert_one(atom_shape);
    }
    async update_by_id(id, partial_atom, options) {
        return await this._al.alter_by_id(id, partial_atom, options);
    }
    async update_one(atom, options) {
        return await this.update_by_id(atom._id, atom, options);
    }
    async remove_by_id(id) {
        return await this._al.delete_by_id(id);
    }
    async remove_one(molecule) {
        return await this.remove_by_id(molecule._id);
    }
    async authorize(action, id) {
        return await this._al.authorize(action, id);
    }
    async find_multiple(ids, options) {
        return await this._al.select({ _id: { $in: ids } }, options);
    }
    // public async find_multiple<D extends schema.Depth>(ids:string[], options?:schema.Query.Options<A,D>)
    //     :Promise<schema.Molecule<A,D>[]>{
    //   return await this._al.select_multiple(ids, options);
    // }
    async update_multiple(ids, partial_atom) {
        return await this._al.alter_multiple(ids, partial_atom);
    }
    async insert_multiple(atom_shapes) {
        return await this._al.insert_multiple(atom_shapes);
    }
    async remove_multiple(ids) {
        return await this._al.delete_multiple(ids);
    }
    async search(string, options) {
        return await this._al.search(string, options);
    }
    async search_count(string) {
        return await this._al.search_count(string);
    }
};
BasicBLL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], BasicBLL);
exports.BasicBLL = BasicBLL;
function create(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create BasicBLL [${atom_name}]`);
    return new BasicBLL(atom_name);
}
exports.create = create;
//# sourceMappingURL=basic.js.map