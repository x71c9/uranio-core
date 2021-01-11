"use strict";
/**
 * Module for Atom Util
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.fix_property = exports.is_molecule = exports.is_atom = exports.get_subatom_name = exports.molecule_to_atom = void 0;
const urn_lib_1 = require("urn-lib");
const urn_exc = urn_lib_1.urn_exception.init('ATOM_UTIL', `Atom Util modul`);
const book_1 = require("../book");
const keys_1 = require("./keys");
const validate_1 = require("./validate");
const types_1 = require("../types");
function molecule_to_atom(atom_name, molecule) {
    const bond_keys = keys_1.get_bond_keys(atom_name);
    let k;
    for (k of bond_keys) {
        const prop_value = molecule[k];
        if (Array.isArray(prop_value)) {
            for (let i = 0; i < prop_value.length; i++) {
                prop_value[i] = (prop_value[i]._id) ? prop_value[i]._id : null;
            }
        }
        else {
            molecule[k] = (prop_value._id) ? prop_value._id : null;
        }
    }
    return molecule;
}
exports.molecule_to_atom = molecule_to_atom;
function get_subatom_name(atom_name, atom_key) {
    const atom_def = book_1.atom_book[atom_name]['properties'];
    const key_string = atom_key;
    if (atom_def[key_string]) {
        if (atom_def[key_string].type === "ATOM" /* ATOM */ ||
            atom_def[key_string].type === "ATOM_ARRAY" /* ATOM_ARRAY */) {
            if (atom_def[key_string].atom) {
                return atom_def[key_string].atom;
            }
            else {
                let err_msg = `Invalid book property definition for [${key_string}].`;
                err_msg += ` Missing 'atom' field.`;
                throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP', err_msg);
            }
        }
        else {
            let err_msg = `Invalid book property type for [${key_string}].`;
            err_msg += ` Type shlould be ATOM or ATOM_ARRAY.`;
            throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP_TYPE', err_msg);
        }
    }
    else {
        let err_msg = `Invalid key [${key_string}].`;
        err_msg += ` Key should be an AtomName.`;
        throw urn_exc.create('GET_ATOM_NAME_INVALID_KEY', err_msg);
    }
}
exports.get_subatom_name = get_subatom_name;
function is_atom(atom_name, atom) {
    const subatom_keys = keys_1.get_bond_keys(atom_name);
    for (const subkey of subatom_keys) {
        if (Array.isArray(atom[subkey])) {
            if (typeof atom[subkey][0] === 'object') {
                return false;
            }
        }
        else if (typeof atom[subkey] === 'object') {
            return false;
        }
    }
    return true;
}
exports.is_atom = is_atom;
function is_molecule(atom_name, molecule) {
    const subatom_keys = keys_1.get_bond_keys(atom_name);
    for (const subkey of subatom_keys) {
        if (Array.isArray(molecule[subkey])) {
            if (typeof molecule[subkey][0] === 'string') {
                return false;
            }
        }
        else if (typeof molecule[subkey] === 'string') {
            return false;
        }
    }
    return true;
}
exports.is_molecule = is_molecule;
function fix_property(atom_name, atom, key) {
    const atom_props = book_1.atom_book[atom_name]['properties'];
    let prop_def = undefined;
    if (urn_lib_1.urn_util.object.has_key(atom_props, key)) {
        prop_def = atom_props[key];
    }
    else if (urn_lib_1.urn_util.object.has_key(types_1.atom_hard_properties, key)) {
        prop_def = types_1.atom_hard_properties[key];
    }
    else if (urn_lib_1.urn_util.object.has_key(types_1.atom_common_properties, key)) {
        prop_def = types_1.atom_common_properties[key];
    }
    if (!prop_def) {
        const err_msg = `Missing or invalid key [${key}] in atom_book`;
        throw urn_exc.create('FIX_MOLECULE_KEY_INVALID_KEY', err_msg);
    }
    const def = prop_def;
    let fixed_value = null;
    if (def.on_error && typeof def.on_error === 'function') {
        fixed_value = def.on_error(atom[key]);
    }
    else if (def.default) {
        fixed_value = def.default;
    }
    try {
        console.log(atom);
        validate_1.validate_property(key, prop_def, fixed_value, atom);
        atom[key] = fixed_value;
    }
    catch (err) {
        let err_msg = `Cannot fix property of Atom. Default value or on_error result is invalid.`;
        err_msg += ` For Atom [${atom_name}] property [${key}]`;
        throw urn_exc.create('CANNOT_FIX', err_msg);
    }
    return atom;
}
exports.fix_property = fix_property;
// export function fix_molecule_property<A extends AtomName, D extends Depth>(
//   atom_name:A,
//   molecule:Molecule<A,D>,
//   key:keyof Molecule<A,D>
// ):Molecule<A,D>{
//   const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
//   let prop_def = undefined;
//   if(urn_util.object.has_key(atom_props, key)){
//     prop_def = atom_props[key as string];
//   }else if(urn_util.object.has_key(atom_hard_properties, key)){
//     prop_def = atom_hard_properties[key];
//   }else if(urn_util.object.has_key(atom_common_properties, key)){
//     prop_def = atom_common_properties[key];
//   }
//   if(!prop_def){
//     const err_msg = `Missing or invalid key [${key}] in atom_book`;
//     throw urn_exc.create('FIX_MOLECULE_KEY_INVALID_KEY', err_msg);
//   }
//   const def = prop_def as Book.Definition.Property;
//   let fixed_value = null;
//   if(def.on_error && typeof def.on_error === 'function'){
//     fixed_value = def.on_error!(molecule[key]);
//   }else if(def.default){
//     fixed_value = def.default;
//   }
//   try{
//     validate_property(key as keyof Atom<A>, prop_def, fixed_value, molecule as Atom<A>);
//     molecule[key] = fixed_value;
//   }catch(err){
//     let err_msg = `Cannot fix property of Atom. Default value or on_error result is invalid.`;
//     err_msg += ` for Atom [${atom_name}] property [${key}]`;
//     throw urn_exc.create('CANNOT_FIX', err_msg);
//   }
//   return molecule;
// }
// export function fix_atom_property<A extends AtomName>(
//   atom_name:A,
//   atom:Atom<A>,
//   key:keyof Atom<A>
// ):Atom<A>{
//   const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
//   let prop_def = undefined;
//   if(urn_util.object.has_key(atom_props, key)){
//     prop_def = atom_props[key as string];
//   }else if(urn_util.object.has_key(atom_hard_properties, key)){
//     prop_def = atom_hard_properties[key];
//   }else if(urn_util.object.has_key(atom_common_properties, key)){
//     prop_def = atom_common_properties[key];
//   }
//   if(!prop_def){
//     const err_msg = `Missing or invalid key [${key}] in atom_book`;
//     throw urn_exc.create('FIX_ATOM_KEY_INVALID_KEY', err_msg);
//   }
//   let fixed_value = null;
//   const def = prop_def as Book.Definition.Property;
//   if(def.on_error && typeof def.on_error === 'function'){
//     fixed_value = def.on_error!(atom[key]);
//   }else if(def.default){
//     fixed_value = def.default;
//   }
//   try{
//     validate_property(key as keyof Atom<A>, prop_def, fixed_value, atom);
//     atom[key] = fixed_value;
//   }catch(err){
//     let err_msg = `Cannot fix property of Atom. Default value or on_error result is invalid.`;
//     err_msg += ` for Atom [${atom_name}] property [${key}]`;
//     throw urn_exc.create('CANNOT_FIX', err_msg);
//   }
//   return atom;
// }
//# sourceMappingURL=util.js.map