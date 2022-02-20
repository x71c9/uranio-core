/**
 * Module for schema.Atom Keys
 *
 * @packageDocumentation
 */

// import schema from 'uranio-schema';

import {schema} from '../sch/index';

import {Book, PropertyType} from '../typ/book_cln';

import * as book from '../book/client';

import {atom_common_properties} from '../stc/index';

export function get_optional<A extends schema.AtomName>(atom_name:A)
		:Set<keyof schema.Atom<A>>{
	const optional_keys = new Set<keyof schema.Atom<A>>();
	const prop_defs = book.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.optional && prop.optional === true){
			optional_keys.add(k as keyof schema.Atom<A>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:Book.Definition.Property = atom_common_properties[k];
		if(prop.optional && prop.optional === true){
			optional_keys.add(k as keyof schema.AtomShape<A>);
		}
	}
	return optional_keys;
}

export function get_hidden<A extends schema.AtomName, D extends schema.Depth = 0>(atom_name:A)
		:Set<keyof schema.Molecule<A,D>>{
	const hidden_keys = new Set<keyof schema.Molecule<A,D>>();
	const prop_defs = book.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.hidden && prop.hidden === true){
			hidden_keys.add(k as keyof schema.Molecule<A,D>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:Book.Definition.Property = atom_common_properties[k];
		if(prop.hidden && prop.hidden === true){
			hidden_keys.add(k as keyof schema.Molecule<A,D>);
		}
	}
	return hidden_keys;
}

export function get_encrypted<A extends schema.AtomName>(atom_name:A)
		:Set<keyof schema.Atom<A>>{
	const encrypt_keys = new Set<keyof schema.Atom<A>>();
	const prop_defs = book.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.type && prop.type === PropertyType.ENCRYPTED){
			encrypt_keys.add(k as keyof schema.Atom<A>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:Book.Definition.Property = atom_common_properties[k];
		// eslint-disable-next-line
		// @ts-ignore
		if(prop.type && prop.type === PropertyType.ENCRYPTED){
			encrypt_keys.add(k as keyof schema.AtomShape<A>);
		}
	}
	return encrypt_keys;
}

export function get_unique<A extends schema.AtomName>(atom_name:A)
		:Set<keyof schema.AtomShape<A>>{
	const unique_keys = new Set<keyof schema.AtomShape<A>>();
	const prop_defs = book.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.unique && prop.unique === true){
			unique_keys.add(k as keyof schema.AtomShape<A>);
		}
	}
	let k:keyof typeof atom_common_properties;
	for(k in atom_common_properties){
		const prop:Book.Definition.Property = atom_common_properties[k];
		if(prop.unique && prop.unique === true){
			unique_keys.add(k as keyof schema.AtomShape<A>);
		}
	}
	return unique_keys;
}

export function get_bond<A extends schema.AtomName, D extends schema.Depth = 0>(atom_name:A)
		:Set<keyof schema.Molecule<A,D>>{
	const subatom_keys = new Set<keyof schema.Molecule<A,D>>();
	const prop_defs = book.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.type && prop.type === PropertyType.ATOM || prop.type === PropertyType.ATOM_ARRAY){
			subatom_keys.add(k as keyof schema.Molecule<A,D>);
		}
	}
	return subatom_keys;
}

export function get_bond_array<A extends schema.AtomName>(atom_name:A)
		:Set<keyof schema.AtomShape<A>>{
	const subatom_keys = new Set<keyof schema.AtomShape<A>>();
	const prop_defs = book.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.type === PropertyType.ATOM_ARRAY){
			subatom_keys.add(k as keyof schema.AtomShape<A>);
		}
	}
	return subatom_keys;
}

export function get_bond_non_array<A extends schema.AtomName>(atom_name:A)
		:Set<keyof schema.AtomShape<A>>{
	const subatom_keys = new Set<keyof schema.AtomShape<A>>();
	const prop_defs = book.get_custom_property_definitions(atom_name);
	for(const k in prop_defs){
		const prop:Book.Definition.Property = prop_defs[k]!;
		if(prop.type === PropertyType.ATOM){
			subatom_keys.add(k as keyof schema.AtomShape<A>);
		}
	}
	return subatom_keys;
}
