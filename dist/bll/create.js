"use strict";
/**
 * Default Class for Business Logic Layer
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
exports.create = void 0;
const urn_lib_1 = require("urn-lib");
const media_1 = require("./media");
const bll_1 = require("./bll");
const book = __importStar(require("../book/server"));
function create(atom_name, passport) {
    urn_lib_1.urn_log.trace(`Create BLL [${atom_name}]`);
    const atom_def = book.get_definition(atom_name);
    const bll_def = atom_def.bll;
    if (bll_def && typeof bll_def.class === 'function') {
        return bll_def.class(passport);
    }
    else if (atom_name === 'media') {
        return (0, media_1.create)(passport);
    }
    else {
        return new bll_1.BLL(atom_name, passport);
    }
}
exports.create = create;
// export type CustomBLL<A extends schema.AtomName> =
//   A extends keyof typeof atom_book ?
//   'bll' extends keyof typeof atom_book[A] ?
//   typeof atom_book[A]['bll'] extends BLL<A> ?
//   typeof atom_book[A]['bll'] :
//   BLL<A> :
//   BLL<A> :
//   BLL<A>;
//# sourceMappingURL=create.js.map