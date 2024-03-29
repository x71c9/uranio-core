"use strict";
/**
 * Register module
 *
 * @packageDocumentation
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.atom = void 0;
const path_1 = __importDefault(require("path"));
const caller_1 = __importDefault(require("caller"));
const uranio_utils_1 = require("uranio-utils");
const book = __importStar(require("../book/server"));
function atom(atom_definition, atom_name) {
    const final_atom_name = _get_atom_name(atom_name);
    book.add_definition(final_atom_name, atom_definition);
    uranio_utils_1.urn_log.debug(`Server atom [${final_atom_name}] registered.`);
    return final_atom_name;
}
exports.atom = atom;
function _get_atom_name(atom_name) {
    let final_atom_name = `undefined_atom`;
    if (atom_name) {
        final_atom_name = atom_name;
    }
    else {
        const caller_path = (0, caller_1.default)();
        const dirname = path_1.default.dirname(caller_path);
        final_atom_name =
            dirname.split('/').slice(-1)[0].replace('.', '_').replace('-', '_');
    }
    return final_atom_name;
}
//# sourceMappingURL=atom.js.map