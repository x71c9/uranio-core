"use strict";
/**
 * Module for Client Book Methods
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_names = void 0;
// import {schema.AtomName} from '../../cln/types';
const base_1 = require("../base");
__exportStar(require("./common"), exports);
function get_names() {
    return Object.keys(base_1.atom_book);
}
exports.get_names = get_names;
//# sourceMappingURL=client.js.map