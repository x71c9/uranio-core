"use strict";
/**
 * Class for Recycle Data Access Layer
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
exports.create_recycle = exports.RecycleDAL = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('RECYCLE_DAL', 'RecycleDAL');
const urn_rel = __importStar(require("../rel/"));
const defaults_1 = require("../conf/defaults");
const basic_1 = require("./basic");
const encrypt_1 = require("./encrypt");
let RecycleDAL = class RecycleDAL extends encrypt_1.EncryptDAL {
    constructor(atom_name) {
        super(atom_name);
        let db_trash_relation;
        switch (defaults_1.core_config.db_type) {
            case 'mongo': {
                db_trash_relation = urn_rel.mongo.trash_create(this.atom_name);
                this.trash_dal = basic_1.create_basic(this.atom_name, db_trash_relation);
                break;
            }
            default: {
                const err_msg = `The Database type in the configuration data is invalid.`;
                throw urn_exc.create('INVALID_DB_TYPE', err_msg);
                break;
            }
        }
    }
    delete_by_id(id) {
        const _super = Object.create(null, {
            delete_by_id: { get: () => super.delete_by_id }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const db_res_delete = yield _super.delete_by_id.call(this, id);
            db_res_delete._deleted_from = db_res_delete._id;
            yield this.trash_dal.insert_one(db_res_delete);
            return db_res_delete;
        });
    }
};
RecycleDAL = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], RecycleDAL);
exports.RecycleDAL = RecycleDAL;
function create_recycle(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create RecycleDAL [${atom_name}]`);
    return new RecycleDAL(atom_name);
}
exports.create_recycle = create_recycle;
//# sourceMappingURL=recycle.js.map