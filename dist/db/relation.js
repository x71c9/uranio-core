"use strict";
/**
 * DB Relation module
 *
 * @packageDocumentation
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.Relation = void 0;
const urn_lib_1 = require("urn-lib");
/**
 * Relation class
 */
let Relation = class Relation {
    constructor(_raw) {
        this._raw = _raw;
    }
    find(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const mon_find_res = (options) ?
                    yield this._raw.find(filter, null, options).lean() :
                    yield this._raw.find(filter).lean();
                return mon_find_res.map((mon_doc) => {
                    return string_id(mon_doc);
                });
            }
            catch (err) {
                throw urn_lib_1.urn_error.create(`Relation.find ERROR.`);
            }
        });
    }
    find_by_id(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const mon_find_by_id_res = yield this._raw.findById(id).lean();
            if (mon_find_by_id_res === null) {
                return null;
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
                return null;
            }
            return string_id(mon_find_one_res);
        });
    }
    insert_one(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Object.prototype.hasOwnProperty.call(resource, '_id')) {
                delete resource._id;
            }
            try {
                const mon_model = new this._raw(resource);
                const mon_res_doc = yield mon_model.save();
                const str_id = mon_res_doc._id.toString();
                const mon_obj = mon_res_doc.toObject();
                mon_obj._id = str_id;
                return mon_obj;
            }
            catch (err) {
                let err_msg = `Relation insert_one() failed. Cannot insert Model.`;
                err_msg += ` ${err.message}`;
                throw urn_lib_1.urn_error.create(err_msg, err);
            }
        });
    }
    update_one(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Object.prototype.hasOwnProperty.call(resource, '_id') ||
                    typeof resource._id !== 'string' ||
                    resource._id === '') {
                    throw urn_lib_1.urn_error.create(`Cannot update. Atom has no _id`);
                }
                const mon_update_res = yield this._raw.findOneAndUpdate({ _id: resource._id }, resource, { new: true, lean: true });
                if (mon_update_res === null) {
                    return null;
                }
                return string_id(mon_update_res);
                // const mon_obj = mon_update_res.toObject();
                // return string_id(mon_obj);
            }
            catch (err) {
                let err_msg = `Relation update_one() failed. Cannot update Model.`;
                err_msg += ` ${err.message}`;
                throw urn_lib_1.urn_error.create(err_msg, err);
            }
        });
    }
};
Relation = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], Relation);
exports.Relation = Relation;
function string_id(resource) {
    if (resource._id) {
        resource._id = resource._id.toString();
    }
    return resource;
}
//# sourceMappingURL=relation.js.map