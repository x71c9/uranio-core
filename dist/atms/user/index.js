"use strict";
/**
 * Atom User module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.module = void 0;
const urn_lib_1 = require("urn-lib");
const types_1 = require("../types");
const class_1 = require("./class");
const atom_1 = require("../atom");
const create = (user) => {
    urn_lib_1.urn_log.fn_debug(`User create`);
    return atom_1.create_atom(user, class_1.User);
};
exports.module = {
    create: create,
    keys: types_1.models.user.keys,
    relation_name: 'urn_user'
};
//# sourceMappingURL=index.js.map