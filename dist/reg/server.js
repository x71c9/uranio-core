"use strict";
/**
 * Register module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const client_1 = require("./client");
function register(atom_definition, atom_name) {
    return (0, client_1.register)(atom_definition, atom_name);
}
exports.register = register;
//# sourceMappingURL=server.js.map