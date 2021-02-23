/**
 * Module for Atom Util
 *
 * @packageDocumentation
 */

import {urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('ATOM_UTIL', `Atom Util module`);

import {atom_book} from 'urn_book';

import * as keys from './keys';

import * as validate from './validate';

import {
	atom_hard_properties,
	atom_common_properties,
	Atom,
	AtomName,
	AuthAtom,
	AuthName,
	Molecule,
	Depth,
	Book,
	BookPropertyType
} from '../types';

export function molecule_to_atom<A extends AtomName, D extends Depth>(atom_name:A, molecule:Molecule<A,D>)
		:Atom<A>{
	const bond_keys = keys.get_bond(atom_name);
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
	const subatom_keys = keys.get_bond(atom_name);
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
	const subatom_keys = keys.get_bond(atom_name) as Set<keyof Molecule<A,D>>;
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

export function is_auth_atom_name<A extends AtomName>(atom_name:A)
		:boolean{
	const atom_def = atom_book[atom_name] as Book.Definition;
	if(atom_def.api && atom_def.api.auth){
		return true;
	}
	return false;
}

export function is_auth_atom<A extends AuthName>(atom:unknown)
		:atom is AuthAtom<A>{
	if(
		urn_util.object.has_key(atom, 'email') &&
		urn_util.object.has_key(atom, 'password') &&
		urn_util.object.has_key(atom, 'groups')
	){
		return true;
	}
	return false;
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
		throw urn_exc.create_invalid_atom('FIX_MOLECULE_KEY_INVALID_KEY', err_msg, atom, [key]);
	}
	const def = prop_def as Book.Definition.Property;
	let fixed_value = null;
	if(def.on_error && typeof def.on_error === 'function'){
		fixed_value = def.on_error((atom as any)[key]);
	}else if(def.default){
		fixed_value = def.default;
	}
	try{
		
		validate.property(key as keyof Atom<A>, prop_def, fixed_value, atom as Atom<A>);
		(atom as any)[key] = fixed_value;
		
	}catch(err){
		let err_msg = `Cannot fix property of Atom. Default value or on_error result is invalid.`;
		err_msg += ` For Atom [${atom_name}] property [${key}]`;
		throw urn_exc.create('CANNOT_FIX', err_msg);
	}
	return atom;
}

export function hide_hidden_properties<A extends AtomName, D extends Depth>(atom_name:A, molecules:Molecule<A,D>):Molecule<A,D>;
export function hide_hidden_properties<A extends AtomName, D extends Depth>(atom_name:A, molecules:Molecule<A,D>[]):Molecule<A,D>[];
export function hide_hidden_properties<A extends AtomName, D extends Depth>(atom_name:A, molecules:Molecule<A,D>|Molecule<A,D>[])
			:Molecule<A,D>|Molecule<A,D>[]{
	if(Array.isArray(molecules)){
		for(let i = 0; i < molecules.length; i++){
			molecules[i] = _hide_hidden_properties_single_molecule(atom_name, molecules[i]);
		}
	}else{
		molecules = _hide_hidden_properties_single_molecule(atom_name, molecules);
	}
	return molecules;
}
	
function _hide_hidden_properties_single_molecule<A extends AtomName, D extends Depth>(atom_name:A, molecule:Molecule<A,D>)
		:Molecule<A,D>{
	
	const hidden_keys = keys.get_hidden(atom_name);
	const bond_keys = keys.get_bond(atom_name);
	
	if(is_atom(atom_name, molecule as Atom<A>)){
		let k:keyof Molecule<A,D>;
		for(k of hidden_keys){
			delete molecule[k];
		}
	}else{
		for(const k in molecule){
			if(hidden_keys.has(k as any)){
				delete molecule[k];
			}else if(bond_keys.has(k as any)){
				const subatom_name = get_subatom_name(atom_name, k);
				molecule[k] = _hide_hidden_properties_single_molecule(subatom_name, molecule[k] as any) as any;
			}
		}
	}
	return molecule;
}

export function is_optional_property<A extends AtomName>(atom_name:A, key:keyof Atom<A>)
		:boolean{
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	let prop_def = undefined;
	if(urn_util.object.has_key(atom_hard_properties, key)){
		prop_def = atom_hard_properties[key];
	}else if(urn_util.object.has_key(atom_common_properties, key)){
		prop_def = atom_common_properties[key];
	}else if(urn_util.object.has_key(atom_props, key)){
		prop_def = atom_props[key];
	}
	if(!prop_def){
		const err_msg = `Atom property definition missing for atom [${atom_name}] property [${key}]`;
		throw urn_exc.create('IS_OPTIONAL_MISSING_ATM_PROP_DEFINITION', err_msg);
	}
	return (
		prop_def &&
		urn_util.object.has_key(prop_def, 'optional') &&
		(prop_def as any).optional === true
	);
}

export function has_property<A extends AtomName>(atom_name:A, key:string):boolean;
export function has_property<A extends AtomName>(atom_name:A, key:keyof Atom<A>):boolean;
export function has_property<A extends AtomName>(atom_name:A, key:keyof Atom<A>|string)
		:boolean{
	if(urn_util.object.has_key(atom_hard_properties, key)){
		return true;
	}
	if(urn_util.object.has_key(atom_common_properties, key)){
		return true;
	}
	if(urn_util.object.has_key(atom_book[atom_name]['properties'], key)){
		return true;
	}
	return false;
}

