"use strict";
/**
 * Mongo Schema generator module
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.models_by_connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const book_1 = require("../../../book");
const defaults_1 = require("../../conf/defaults");
const schema_1 = require("./schema");
const mongo_connection = __importStar(require("./connection"));
const mongo_main_conn = mongo_connection.create('main', defaults_1.core_config.db_host, defaults_1.core_config.db_port, defaults_1.core_config.db_name);
const mongo_trash_conn = mongo_connection.create('trash', defaults_1.core_config.db_host, defaults_1.core_config.db_port, defaults_1.core_config.db_trash_name);
function _create_main_models() {
    const model_by_atom_name = new Map();
    let atom_name;
    for (atom_name in book_1.atom_book) {
        const atom_schema_def = schema_1.generate_mongo_schema_def(atom_name);
        const atom_mongo_schema = new mongoose_1.default.Schema(atom_schema_def, { versionKey: false });
        const atom_model = mongo_main_conn.create_model(atom_name, atom_mongo_schema);
        model_by_atom_name.set(atom_name, atom_model);
    }
    return model_by_atom_name;
}
function _create_trash_models() {
    const model_by_atom_name = new Map();
    let atom_name;
    for (atom_name in book_1.atom_book) {
        const atom_schema_def = _convert_for_trash(schema_1.generate_mongo_schema_def(atom_name));
        const atom_mongo_schema = new mongoose_1.default.Schema(atom_schema_def, { versionKey: false, strict: false });
        const atom_model = mongo_trash_conn.create_model(atom_name, atom_mongo_schema);
        model_by_atom_name.set(atom_name, atom_model);
    }
    return model_by_atom_name;
}
// function _allow_duplicate(schema_definition:mongoose.SchemaDefinition)
//     :mongoose.SchemaDefinition{
//   const schema_without_unique:mongoose.SchemaDefinition = {...schema_definition};
//   for(const [k] of Object.entries(schema_without_unique)){
//     if(urn_util.object.has_key(schema_without_unique[k], 'unique')){
//       delete (schema_without_unique[k] as any).unique;
//     }
//   }
//   return schema_without_unique;
// }
function _convert_for_trash(schema_definition) {
    const schema_without_unique = Object.assign({}, schema_definition);
    for (const [k] of Object.entries(schema_without_unique)) {
        schema_without_unique[k] = { type: 'Mixed' };
    }
    return schema_without_unique;
}
const main_connection_models = _create_main_models();
const trash_connection_models = _create_trash_models();
const models_by_connection = new Map();
exports.models_by_connection = models_by_connection;
models_by_connection.set('main', main_connection_models);
models_by_connection.set('trash', trash_connection_models);
//# sourceMappingURL=models.js.map