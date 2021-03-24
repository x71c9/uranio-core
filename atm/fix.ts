/**
 * Module for Atom Util
 *
 * @packageDocumentation
 */

import {urn_exception, urn_util} from 'urn-lib';

const urn_exc = urn_exception.init('ATOM_FIX', `Atom Fix module`);

import {atom_book} from 'urn_books';

import * as validate from './validate';

import {
	atom_hard_properties,
	atom_common_properties,
	Atom,
	AtomName,
	Molecule,
	Depth,
	Book,
} from '../typ/';

export function property<A extends AtomName>(
	atom_name:A,
	atom:Atom<A>,
	key:keyof Atom<A>
):Atom<A>;
export function property<A extends AtomName, D extends Depth>(
	atom_name:A,
	atom:Molecule<A,D>,
	key:keyof Molecule<A,D>
):Molecule<A,D>;
export function property<A extends AtomName, D extends Depth>(
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
