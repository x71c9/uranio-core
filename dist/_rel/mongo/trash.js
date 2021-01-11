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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseTrashRelation = void 0;
const urn_lib_1 = require("urn-lib");
const schemas_1 = require("./schemas/");
const mongo_connection = __importStar(require("./connection"));
const relation_1 = require("./relation");
const defaults_1 = require("../../defaults");
const mongo_trash_conn = mongo_connection.create('trash', defaults_1.core_config.db_host, defaults_1.core_config.db_port, defaults_1.core_config.db_trash_name);
/**
 * Mongoose Trash Relation class
 */
let MongooseTrashRelation = class MongooseTrashRelation extends relation_1.MongooseRelation {
    constructor(relation_name) {
        super(relation_name);
        this.relation_name = relation_name;
    }
    _get_connection() {
        return mongo_trash_conn;
    }
    _complie_mongoose_model() {
        return this._conn.get_model(this.relation_name, schemas_1.mongo_trash_schemas[this.relation_name]);
    }
};
MongooseTrashRelation = __decorate([
    urn_lib_1.urn_log.decorators.debug_constructor,
    urn_lib_1.urn_log.decorators.debug_methods
], MongooseTrashRelation);
exports.MongooseTrashRelation = MongooseTrashRelation;
// export type MongooseTrashRelationInstance = InstanceType<typeof MongooseTrashRelation>;
// export function create(relation_name:RelationName):MongooseTrashRelationInstance{
//   urn_log.fn_debug(`Create Mongoose Trash Relation`);
//   return new MongooseTrashRelation(relation_name);
// }
//# sourceMappingURL=trash.js.map