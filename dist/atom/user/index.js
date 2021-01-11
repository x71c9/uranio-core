"use strict";
/**
 * Atom User module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const urn_lib_1 = require("urn-lib");
const class_1 = require("./class");
const atom_1 = require("../atom");
exports.create = (user) => {
    urn_lib_1.urn_log.fn_debug(`User create`);
    return atom_1.create_atom(user, class_1.User);
};
// export const module:AtomModule<models.User, User> = {
//   keys: user_keys,
//   create: create,
//   schema: schema
// };
//# sourceMappingURL=index.js.map