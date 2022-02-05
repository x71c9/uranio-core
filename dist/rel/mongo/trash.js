"use strict";
/**
 * Mongoose Relation module
 *
 * @packageDocumentation
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trash_create = exports.MongooseTrashRelation = void 0;
const urn_lib_1 = require("urn-lib");
// import {ConnectionName} from './types';
const relation_1 = require("./relation");
/**
 * Mongoose Trash Relation class
 */
let MongooseTrashRelation = class MongooseTrashRelation extends relation_1.MongooseRelation {
    constructor(atom_name) {
        super(atom_name);
    }
    _get_conn_name() {
        return 'trash';
    }
};
MongooseTrashRelation = __decorate([
    urn_lib_1.urn_log.util.decorators.debug_constructor,
    urn_lib_1.urn_log.util.decorators.debug_methods
], MongooseTrashRelation);
exports.MongooseTrashRelation = MongooseTrashRelation;
function trash_create(atom_name) {
    urn_lib_1.urn_log.fn_debug(`Create MongooseTrashRelation`);
    return new MongooseTrashRelation(atom_name);
}
exports.trash_create = trash_create;
//# sourceMappingURL=trash.js.map