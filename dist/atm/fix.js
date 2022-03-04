"use strict";
/**
 * Module for schema.Atom Util
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
exports.property = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('ATOM_FIX', `schema.Atom Fix module`);
const validate = __importStar(require("./validate"));
const book = __importStar(require("../book/client"));
// export function property<A extends schema.AtomName>(
//   atom_name:A,
//   atom:schema.Atom<A>,
//   key:keyof schema.Atom<A>
// ):schema.Atom<A>;
function property(atom_name, atom, key) {
    // export function property<A extends schema.AtomName, D extends schema.Depth>(
    //   atom_name:A,
    //   atom:schema.Atom<A> | schema.Molecule<A,D>,
    //   key: keyof schema.Atom<A> | keyof schema.Molecule<A,D>
    // ):schema.Atom<A> | schema.Molecule<A,D>{
    const prop_def = book.get_property_definition(atom_name, key);
    let fixed_value = null;
    let fix_defined = false;
    if (prop_def.on_error && typeof prop_def.on_error === 'function') {
        fixed_value = prop_def.on_error(atom[key]);
        fix_defined = true;
    }
    else if (prop_def.default) {
        fixed_value = prop_def.default;
        fix_defined = true;
    }
    try {
        validate.property(key, prop_def, fixed_value, atom);
        atom[key] = fixed_value;
    }
    catch (err) {
        let err_msg = `Cannot fix property of schema.Atom [${atom._id}].`;
        if (fix_defined) {
            err_msg += ` Default value or on_error result is invalid.`;
        }
        else {
            err_msg += ` Fix method not defined.`;
            err_msg += ` Please define a \`default\` value or a \`on_error\` function`;
            err_msg += ` in atom definition.`;
        }
        err_msg += ` For schema.Atom \`${atom_name}\` property \`${key}\``;
        throw urn_exc.create('CANNOT_FIX', err_msg);
    }
    return atom;
}
exports.property = property;
//# sourceMappingURL=fix.js.map