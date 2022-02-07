"use strict";
/**
 * Register module
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
// import path from 'path';
// import caller from 'caller';
// import {urn_log} from 'urn-lib';
const book = __importStar(require("../book/"));
function register(atom_name, atom_definition) {
    // const caller_path = caller();
    // urn_log.debug(`Register Caller: ${caller_path}`);
    // const dirname = path.dirname(caller_path);
    // const atom_dir_name = dirname.split('/').slice(-1)[0];
    // book.add_definition(atom_dir_name, atom_definition);
    book.add_definition(atom_name, atom_definition);
    return atom_definition;
}
exports.register = register;
//# sourceMappingURL=register.js.map