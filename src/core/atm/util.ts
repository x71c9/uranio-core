/**
 * Module for Atom Util
 *
 * @packageDocumentation
 */

import {atom_book} from '@book';

import {urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('ATOM_UTIL', `Atom Util modul`);

import {get_bond_keys} from './keys';

import {validate_property} from './validate';

import {
	atom_hard_properties,
	atom_common_properties,
	Atom,
	AtomName,
	Molecule,
	Depth,
	Book,
	BookPropertyType
} from '../types';

export function molecule_to_atom<A extends AtomName, D extends Depth>(atom_name:A, molecule:Molecule<A,D>)
		:Atom<A>{
	const bond_keys = get_bond_keys(atom_name);
	let k:keyof Molecule<A,D>;
	for(k of bond_keys){
		const prop_value = molecule[k];
		if(Array.isArray(prop_value)){
			for(let i = 0; i < prop_value.length; i++){
				prop_value[i] = (prop_value[i]._id) ? prop_value[i]._id : null;
			}
		}else{
			molecule[k] = ((prop_value as any)._id) ? (prop_value as any)._id : null;
		}
	}
	return molecule as Atom<A>;
}

export function get_subatom_name<A extends AtomName>(atom_name:A ,atom_key:string)
		:AtomName{
	const atom_def = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	const key_string = atom_key as string;
	if(atom_def[key_string]){
		if(
			atom_def[key_string].type === BookPropertyType.ATOM ||
			atom_def[key_string].type === BookPropertyType.ATOM_ARRAY
		){
			if((atom_def[key_string] as Book.Definition.Property.Atom).atom){
				return (atom_def[key_string] as Book.Definition.Property.Atom).atom;
			}else{
				let err_msg = `Invalid book property definition for [${key_string}].`;
				err_msg += ` Missing 'atom' field.`;
				throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP', err_msg);
			}
		}else{
			let err_msg = `Invalid book property type for [${key_string}].`;
			err_msg += ` Type shlould be ATOM or ATOM_ARRAY.`;
			throw urn_exc.create('GET_ATOM_NAME_INVALID_BOOK_PROP_TYPE', err_msg);
		}
	}else{
		let err_msg = `Invalid key [${key_string}].`;
		err_msg += ` Key should be an AtomName.`;
		throw urn_exc.create('GET_ATOM_NAME_INVALID_KEY', err_msg);
	}
}

export function is_atom<A extends AtomName>(atom_name:A, atom:Atom<A>)
		:atom is Atom<A>{
	const subatom_keys = get_bond_keys(atom_name);
	for(const subkey of subatom_keys){
		if(Array.isArray(atom[subkey])){
			if(typeof (atom[subkey] as Array<any>)[0] === 'object'){
				return false;
			}
		}else if(typeof atom[subkey] === 'object'){
			return false;
		}
	}
	return true;
}

export function is_molecule<A extends AtomName, D extends Depth>(atom_name:A, molecule:Molecule<A,D>)
		:molecule is Molecule<A,D>{
	const subatom_keys = get_bond_keys(atom_name) as Set<keyof Molecule<A,D>>;
	for(const subkey of subatom_keys){
		if(Array.isArray(molecule[subkey])){
			if(typeof (molecule[subkey] as Array<any>)[0] === 'string'){
				return false;
			}
		}else if(typeof molecule[subkey] === 'string'){
			return false;
		}
	}
	return true;
}

export function fix_property<A extends AtomName>(
	atom_name:A,
	atom:Atom<A>,
	key:keyof Atom<A>
):Atom<A>;
export function fix_property<A extends AtomName, D extends Depth>(
	atom_name:A,
	atom:Molecule<A,D>,
	key:keyof Molecule<A,D>
):Molecule<A,D>;
export function fix_property<A extends AtomName, D extends Depth>(
	atom_name:A,
	atom:Atom<A> | Molecule<A,D>,
	key: keyof Atom<A> | keyof Molecule<A,D>
):Atom<A> | Molecule<A,D>{
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	let prop_def = undefined;
	if(urn_util.object.has_key(atom_props, key)){
		prop_def = atom_props[key as string];
	}else if(urn_util.object.has_key(atom_hard_properties, key)){
		prop_def = atom_hard_properties[key];
	}else if(urn_util.object.has_key(atom_common_properties, key)){
		prop_def = atom_common_properties[key];
	}
	if(!prop_def){
		const err_msg = `Missing or invalid key [${key}] in atom_book`;
		throw urn_exc.create('FIX_MOLECULE_KEY_INVALID_KEY', err_msg);
	}
	const def = prop_def as Book.Definition.Property;
	let fixed_value = null;
	if(def.on_error && typeof def.on_error === 'function'){
		fixed_value = def.on_error((atom as any)[key]);
	}else if(def.default){
		fixed_value = def.default;
	}
	try{
		
		console.log(atom);
		validate_property(key as keyof Atom<A>, prop_def, fixed_value, atom as Atom<A>);
		(atom as any)[key] = fixed_value;
		
	}catch(err){
		let err_msg = `Cannot fix property of Atom. Default value or on_error result is invalid.`;
		err_msg += ` For Atom [${atom_name}] property [${key}]`;
		throw urn_exc.create('CANNOT_FIX', err_msg);
	}
	return atom;
}


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

