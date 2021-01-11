"use strict";
/**
 * Atom User module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.module = exports.create = void 0;
const urn_lib_1 = require("urn-lib");
const types_1 = require("../types");
const class_1 = require("./class");
const abstract_1 = require("../abstract");
exports.create = (model) => {
    urn_lib_1.urn_log.fn_debug(`User create`);
    return abstract_1.create_atom(model, class_1.User);
};
exports.module = {
    create: exports.create,
    keys: types_1.models.user.keys,
    relation_name: 'urn_user'
};
//# sourceMappingURL=index.js.map