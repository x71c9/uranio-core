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
exports.BookPermission = exports.BookSecurity = exports.BookProperty = void 0;
const book_cln_1 = require("./book_cln");
Object.defineProperty(exports, "BookProperty", { enumerable: true, get: function () { return book_cln_1.BookProperty; } });
var BookSecurity;
(function (BookSecurity) {
    BookSecurity["UNIFORM"] = "UNIFORM";
    BookSecurity["GRANULAR"] = "GRANULAR";
})(BookSecurity = exports.BookSecurity || (exports.BookSecurity = {}));
var BookPermission;
(function (BookPermission) {
    BookPermission["NOBODY"] = "NOBODY";
    BookPermission["PUBLIC"] = "PUBLIC";
})(BookPermission = exports.BookPermission || (exports.BookPermission = {}));
//# sourceMappingURL=book_srv.js.map