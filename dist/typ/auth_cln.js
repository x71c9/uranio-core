"use strict";
/**
 * Auth types module
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAction = void 0;
// With "const" typescript will no transpile any code and delete the reference.
// While without "const" ts will tranpile in a JS object. So it is possible to
// check if a value is included in the enum.
// https://thisthat.dev/const-enum-vs-enum/
// It is possible to preserve the const with "preserveConstEnums" in tsconfig
var AuthAction;
(function (AuthAction) {
    AuthAction["READ"] = "READ";
    AuthAction["WRITE"] = "WRITE";
    AuthAction["AUTH"] = "AUTH";
})(AuthAction = exports.AuthAction || (exports.AuthAction = {}));
//# sourceMappingURL=auth_cln.js.map