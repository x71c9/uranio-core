"use strict";
/**
 * Required module
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const atoms_1 = require("../atoms");
const conf = __importStar(require("../conf/client"));
function get() {
    if (conf.get('default_atoms_superuser') === false) {
        delete atoms_1.atom_book.superuser;
    }
    if (conf.get('default_atoms_group') === false) {
        delete atoms_1.atom_book.group;
    }
    if (conf.get('default_atoms_user') === false) {
        delete atoms_1.atom_book.user;
    }
    if (conf.get('default_atoms_media') === false) {
        delete atoms_1.atom_book.media;
    }
    return {
        ...atoms_1.atom_book
    };
}
exports.get = get;
//# sourceMappingURL=client.js.map