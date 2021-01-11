"use strict";
/**
 * Export modules for Mongoose schemas
 *
 * @packageDocumentation
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongo_trash_schemas = exports.mongo_schemas = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const urn_lib_1 = require("urn-lib");
const urn_user_1 = require("./urn_user");
exports.mongo_schemas = {
    urn_user: new mongoose_1.default.Schema(urn_user_1.user_schema_definition)
};
exports.mongo_trash_schemas = {
    urn_user: new mongoose_1.default.Schema(_allow_duplicate(urn_user_1.user_schema_definition))
};
function _allow_duplicate(schema_definition) {
    const schema_without_unique = Object.assign({}, schema_definition);
    for (const [k] of Object.entries(schema_without_unique)) {
        if (urn_lib_1.urn_util.object.has_key(schema_without_unique[k], 'unique')) {
            delete schema_without_unique[k].unique;
        }
    }
    return schema_without_unique;
}
//# sourceMappingURL=index.js.map