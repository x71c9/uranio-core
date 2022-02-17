"use strict";
/**
 * Register module for URANIO Core.
 *
 * There is no actual need for this module but to make everything equal
 * between repos [core, api, trx, ...].
 *
 * Plus the script `yarn types` will fail if it does not found this file.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./reg/index");
const atoms_1 = require("./atoms");
for (const [atom_name, atom_def] of Object.entries(atoms_1.atom_book)) {
    (0, index_1.register)(atom_def, atom_name);
}
//# sourceMappingURL=register.js.map