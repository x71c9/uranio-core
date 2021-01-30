/**
 * Module for Atom Keys
 *
 * @packageDocumentation
 */

import {atom_book} from '@book';

import {
	atom_common_properties,
	AtomName,
	Atom,
	AtomShape,
	Molecule,
	Book,
	BookPropertyType
} from '../types';

export function get_encrypted_keys<A extends AtomName>(atom_name:A)
		:Set<keyof Atom<A>>{
	const encrypt_keys = new Set<keyof Atom<A>>();
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	for(const k in atom_props){
		const prop:Book.Definition.Property = atom_props[k];
		if(prop.type && prop.type === BookPropertyType.ENCRYPTED){
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
		if(prop.unique && prop.unique === true){
			unique_keys.add(k as keyof AtomShape<A>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:Book.Definition.Property = atom_common_properties[k];
		if(prop.unique && prop.unique === true){
			unique_keys.add(k as keyof AtomShape<A>);
		}
	}
	return unique_keys;
}

export function get_bond_keys<A extends AtomName>(atom_name:A)
		:Set<keyof Molecule<A>>{
	const subatom_keys = new Set<keyof Molecule<A>>();
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	for(const k in atom_props){
		const prop:Book.Definition.Property = atom_props[k];
		if(prop.type && prop.type === BookPropertyType.ATOM || prop.type === BookPropertyType.ATOM_ARRAY){
			subatom_keys.add(k as keyof Molecule<A>);
		}
	}
	return subatom_keys;
}

export function get_subatom_array_keys<A extends AtomName>(atom_name:A)
		:Set<keyof AtomShape<A>>{
	const subatom_keys = new Set<keyof AtomShape<A>>();
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	for(const k in atom_props){
		const prop:Book.Definition.Property = atom_props[k];
		if(prop.type === BookPropertyType.ATOM_ARRAY){
			subatom_keys.add(k as keyof AtomShape<A>);
		}
	}
	return subatom_keys;
}

export function get_subatom_non_array_keys<A extends AtomName>(atom_name:A)
		:Set<keyof AtomShape<A>>{
	const subatom_keys = new Set<keyof AtomShape<A>>();
	const atom_props = atom_book[atom_name]['properties'] as Book.Definition.Properties;
	for(const k in atom_props){
		const prop:Book.Definition.Property = atom_props[k];
		if(prop.type === BookPropertyType.ATOM){
			subatom_keys.add(k as keyof AtomShape<A>);
		}
	}
	return subatom_keys;
}
