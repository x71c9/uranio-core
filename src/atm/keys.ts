/**
 * Module for Atom Keys
 *
 * @packageDocumentation
 */

import {urn_util} from 'urn-lib';

import {atom_book} from '../book';

import {
	atom_common_properties,
	AtomName,
	Atom,
	AtomShape,
	// KeyOfAtom,
	// KeyOfAtomShape,
	Book,
	BookPropertyType
} from '../types';

export function get_encrypted_keys<A extends AtomName>(atom_name:A)
		:Set<keyof Atom<A>>{
	const encrypt_keys = new Set<keyof Atom<A>>();
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	for(const k in atom_props){
		const prop:Book.Definition.Property = atom_props[k];
		if(urn_util.object.has_key(prop, 'type') && prop.type === BookPropertyType.ENCRYPTED){
			encrypt_keys.add(k as keyof Atom<A>);
		}
	}
	return encrypt_keys;
}

export function get_unique_keys<A extends AtomName>(atom_name:A)
		:Set<keyof AtomShape<A>>{
	const unique_keys = new Set<keyof AtomShape<A>>();
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	for(const k in atom_props){
		const prop:Book.Definition.Property = atom_props[k];
		if(urn_util.object.has_key(prop, 'unique') && prop.unique === true){
			unique_keys.add(k as keyof AtomShape<A>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:Book.Definition.Property = atom_common_properties[k];
		if(urn_util.object.has_key(prop, 'unique') && prop.unique === true){
			unique_keys.add(k as keyof AtomShape<A>);
		}
	}
	return unique_keys;
}

