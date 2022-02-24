"use strict";
/**
 * Server Book types module
 *
 * This module defines the type of the `atom_book` for the Server.
 * It extends the defintion of the Client Book type.
 *
 * In order to copy and reexport namespaces and types we use the syntax
 * `export import`.
 *
 * `type Book` must be redifined.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionType = exports.SecurityType = exports.PropertyType = void 0;
const book_cln_1 = require("./book_cln");
Object.defineProperty(exports, "PropertyType", { enumerable: true, get: function () { return book_cln_1.PropertyType; } });
Object.defineProperty(exports, "SecurityType", { enumerable: true, get: function () { return book_cln_1.SecurityType; } });
Object.defineProperty(exports, "PermissionType", { enumerable: true, get: function () { return book_cln_1.PermissionType; } });
//# sourceMappingURL=book.js.map