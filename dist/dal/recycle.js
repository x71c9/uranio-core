"use strict";
/**
 * Class for Recycle Data Access Layer
 *
 * This class will move a deleted schema.Atom to the Trash database instead of just
 * deleting it.
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
exports.create_recycle = exports.RecycleDAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_rel = __importStar(require("../rel/server"));
const conf = __importStar(require("../conf/server"));
const basic_1 = require("./basic");
const encrypt_1 = require("./encrypt");
const book = __importStar(require("../book/server"));
let RecycleDAL = class RecycleDAL extends encrypt_1.EncryptDAL {
    get trash_dal() {
        if (this._trash_dal === undefined) {
            let db_trash_relation;
            const atom_def = book.get_definition(this.atom_name);
            if (!atom_def.connection || atom_def.connection === 'main') {
                switch (conf.get(`db`)) {
                    case 'mongo': {
                        db_trash_relation = urn_rel.mongo.trash_create(this.atom_name);
                        this._trash_dal = (0, basic_1.create_basic)(this.atom_name, db_trash_relation);
                        break;
                    }
                    // default:{
                    //   const err_msg = `The Database type in the configuration data is invalid.`;
                    //   throw urn_exc.create('INVALID_DB_TYPE', err_msg);
                    // }
                }
            }
        }
        return this._trash_dal;
    }
    async delete_by_id(id) {
        const db_res_delete = await super.delete_by_id(id);
        if (!this.trash_dal)
            return db_res_delete;
        db_res_delete._from = db_res_delete._id;
        await this.trash_dal.insert_one(db_res_delete);
        // db_res_delete._id = id;
        return db_res_delete;
    }
    async delete_multiple(ids) {
        const db_res_delete = await super.delete_multiple(ids);
        if (!this.trash_dal)
            return db_res_delete;
        for (const del of db_res_delete) {
            del._from = del._id;
        }
        await this.trash_dal.insert_multiple(db_res_delete);
        // db_res_delete._id = id;
        return db_res_delete;
    }
};
RecycleDAL = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], RecycleDAL);
exports.RecycleDAL = RecycleDAL;
function create_recycle(atom_name) {
    urn_lib_1.urn_log.trace(`Create RecycleDAL [${atom_name}]`);
    return new RecycleDAL(atom_name);
}
exports.create_recycle = create_recycle;
//# sourceMappingURL=recycle.js.map