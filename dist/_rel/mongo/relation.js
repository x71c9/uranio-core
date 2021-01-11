"use strict";
/**
 * Mongoose Relation module
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
exports.MongooseRelation = void 0;
const urn_lib_1 = require("urn-lib");
const mongo_connection = __importStar(require("./connection"));
const schemas_1 = require("./schemas/");
const defaults_1 = require("../../defaults");
const mongo_main_conn = mongo_connection.create('main', defaults_1.core_config.db_host, defaults_1.core_config.db_port, defaults_1.core_config.db_name);
const urn_exc = urn_lib_1.urn_exception.init('REL_M', 'Mongoose Relation');
/**
 * Mongoose Relation class
 */
let MongooseRelation = class MongooseRelation {
    constructor(relation_name) {
        this.relation_name = relation_name;
        this._conn = this._get_connection();
        this._raw = this._complie_mongoose_model();
    }
    _get_connection() {
        return mongo_main_conn;
    }
    _complie_mongoose_model() {
        return this._conn.get_model(this.relation_name, schemas_1.mongo_schemas[this.relation_name]);
    }
    find(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const mon_find_res = (options) ?
                yield this._raw.find(filter, null, options).lean() :
                yield this._raw.find(filter).lean();
            return mon_find_res.map((mon_doc) => {
                return string_id(mon_doc);
            });
        });
    }
    find_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mon_find_by_id_res = yield this._raw.findById(id).lean();
            if (mon_find_by_id_res === null) {
                throw urn_exc.create_not_found('FIND_ID_NOT_FOUND', `Record not found.`);
            }
            return string_id(mon_find_by_id_res);
        });
    }
    find_one(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const mon_find_one_res = (typeof options !== 'undefined' && options.sort) ?
                yield this._raw.findOne(filter).sort(options.sort).lean() :
                yield this._raw.findOne(filter).lean();
            if (mon_find_one_res === null) {
                throw urn_exc.create_not_found('FIND_ONE_NOT_FOUND', `Record not found.`);
            }
            return string_id(mon_find_one_res);
        });
    }
    insert_one(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            if (urn_lib_1.urn_util.object.has_key(resource, '_id')) {
                delete resource._id;
            }
            const mon_model = new this._raw(resource);
            const mon_res_doc = yield mon_model.save();
            const str_id = mon_res_doc._id.toString();
            const mon_obj = mon_res_doc.toObject();
            mon_obj._id = str_id;
            return mon_obj;
        });
    }
    alter_one(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!urn_lib_1.urn_util.object.has_key(resource, '_id')) {
                const err_msg = `Cannot alter_one. Argument has no _id.`;
                throw urn_exc.create('UPD_ONE_NO_ID', err_msg);
            }
            if (typeof resource._id !== 'string' || resource._id === '' || !this.is_valid_id(resource._id)) {
                const err_msg = `Cannot alter_one. Argument has invalid _id.`;
                throw urn_exc.create('UPD_ONE_INVALID_ID', err_msg);
            }
            const mon_update_res = yield this._raw.findOneAndUpdate({ _id: resource._id }, resource, { new: true, lean: true });
            if (mon_update_res === null) {
                throw urn_exc.create('UPD_ONE_NOT_FOUND', `Cannot alter_one. Record not found.`);
            }
            return string_id(mon_update_res);
            // const mon_obj = mon_update_res.toObject();
            // return string_id(mon_obj);
        });
    }
    delete_one(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!urn_lib_1.urn_util.object.has_key(resource, '_id')) {
                const err_msg = `Cannot delete_one. Argument has no _id.`;
                throw urn_exc.create('DEL_ONE_NO_ID', err_msg);
            }
            if (typeof resource._id !== 'string' || resource._id === '' || !this.is_valid_id(resource._id)) {
                const err_msg = `Cannot delete_one. Argument has invalid _id.`;
                throw urn_exc.create('DEL_ONE_INVALID_ID', err_msg);
            }
            const mon_delete_res = yield this._raw.findOneAndDelete({ _id: resource._id });
            if (typeof mon_delete_res !== 'object' || mon_delete_res === null) {
                throw urn_exc.create_not_found('DEL_ONE_NOT_FOUND', `Cannot delete_one. Record not found.`);
            }
            return string_id(mon_delete_res.toObject());
        });
    }
    is_valid_id(id) {
        return this._conn.is_valid_id(id);
    }
};
MongooseRelation = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], MongooseRelation);
exports.MongooseRelation = MongooseRelation;
function string_id(resource) {
    if (resource._id) {
        resource._id = resource._id.toString();
    }
    return resource;
}
//# sourceMappingURL=relation.js.map