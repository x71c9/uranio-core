/**
 * Module for Atom Keys
 *
 * @packageDocumentation
 */

import {
	AtomName,
	Atom,
	AtomShape,
	Molecule,
} from '../typ/atom';

import {Book} from '../typ/book_cln';

import {BookPropertyType} from '../typ/common';

import {
	atom_common_properties
} from '../stc/';

import * as book from '../book/client';

export function get_optional<A extends AtomName>(atom_name:A)
		:Set<keyof Atom<A>>{
	const optional_keys = new Set<keyof Atom<A>>();
	const prop_defs = book.atom.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.optional && prop.optional === true){
			optional_keys.add(k as keyof Atom<A>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:Book.Definition.Property = atom_common_properties[k];
		if(prop.optional && prop.optional === true){
			optional_keys.add(k as keyof AtomShape<A>);
		}
	}
	return optional_keys;
}

export function get_hidden<A extends AtomName>(atom_name:A)
		:Set<keyof Atom<A>>{
	const hidden_keys = new Set<keyof Atom<A>>();
	const prop_defs = book.atom.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.hidden && prop.hidden === true){
			hidden_keys.add(k as keyof Atom<A>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:Book.Definition.Property = atom_common_properties[k];
		if(prop.hidden && prop.hidden === true){
			hidden_keys.add(k as keyof AtomShape<A>);
		}
	}
	return hidden_keys;
}

export function get_encrypted<A extends AtomName>(atom_name:A)
		:Set<keyof Atom<A>>{
	const encrypt_keys = new Set<keyof Atom<A>>();
	const prop_defs = book.atom.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.type && prop.type === BookPropertyType.ENCRYPTED){
			encrypt_keys.add(k as keyof Atom<A>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:Book.Definition.Property = atom_common_properties[k];
		// eslint-disable-next-line
		// @ts-ignore
		if(prop.type && prop.type === BookPropertyType.ENCRYPTED){
			encrypt_keys.add(k as keyof AtomShape<A>);
		}
	}
	return encrypt_keys;
}

export function get_unique<A extends AtomName>(atom_name:A)
		:Set<keyof AtomShape<A>>{
	const unique_keys = new Set<keyof AtomShape<A>>();
	const prop_defs = book.atom.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
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

export function get_bond<A extends AtomName>(atom_name:A)
		:Set<keyof Molecule<A>>{
	const subatom_keys = new Set<keyof Molecule<A>>();
	const prop_defs = book.atom.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.type && prop.type === BookPropertyType.ATOM || prop.type === BookPropertyType.ATOM_ARRAY){
			subatom_keys.add(k as keyof Molecule<A>);
		}
	}
	return subatom_keys;
}

export function get_bond_array<A extends AtomName>(atom_name:A)
		:Set<keyof AtomShape<A>>{
	const subatom_keys = new Set<keyof AtomShape<A>>();
	const prop_defs = book.atom.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.type === BookPropertyType.ATOM_ARRAY){
			subatom_keys.add(k as keyof AtomShape<A>);
		}
	}
	return subatom_keys;
}

export function get_bond_non_array<A extends AtomName>(atom_name:A)
		:Set<keyof AtomShape<A>>{
	const subatom_keys = new Set<keyof AtomShape<A>>();
	const prop_defs = book.atom.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.type === BookPropertyType.ATOM){
			subatom_keys.add(k as keyof AtomShape<A>);
		}
	}
	return subatom_keys;
}
