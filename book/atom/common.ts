/**
 * Common module for Atom Book Methods
 *
 * Since type Book is different between Server and Client we need two different
 * module with methods with different return types.
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'urn-lib';

const urn_exc = urn_exception.init('BOOK_METHODS_MODULE', `Book methods module`);

import {atom_book} from 'uranio-books/atom';

import {
	AtomName,
} from '../../typ/atom';

import {Book} from '../../typ/book_cln';

import {
	atom_hard_properties,
	atom_common_properties,
} from '../../stc/';

export function validate_name(atom_name:string):boolean{
	return urn_util.object.has_key(atom_book, atom_name);
}

export function get_definition<A extends AtomName>(atom_name:A)
		:Book.BasicDefinition{
	return atom_book[atom_name] as unknown as Book.BasicDefinition;
}

export function get_property_definition<A extends AtomName>(atom_name:A, property_name:keyof Book.Definition.Properties)
		:Book.Definition.Property{
	const prop_defs = atom_book[atom_name].properties;
	if(urn_util.object.has_key(prop_defs, property_name)){
		return prop_defs[property_name];
	}else if(urn_util.object.has_key(atom_hard_properties, property_name)){
		return atom_hard_properties[property_name];
	}else if(urn_util.object.has_key(atom_common_properties, property_name)){
		return atom_common_properties[property_name];
	}
	throw urn_exc.create('INVALID_PROPERTY_NAME', `Definition for \`${property_name}\` for Atom \`${atom_name}\` not found.`);
}

export function get_custom_property_definitions<A extends AtomName>(atom_name:A)
		:Book.Definition.Properties{
	const atom_def = atom_book[atom_name] as unknown as Book.BasicDefinition;
	return atom_def.properties as Book.Definition.Properties;
}
export function get_all_property_definitions<A extends AtomName>(atom_name:A)
		:Book.Definition.Properties{
	const custom_defs = get_custom_property_definitions(atom_name);
	const prop_defs = {
		...atom_hard_properties,
		...atom_common_properties,
		...custom_defs
	};
	return prop_defs;
}

export function has_property<A extends AtomName>(atom_name:A, key:string)
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
