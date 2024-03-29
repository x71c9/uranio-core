/**
 * Module for Client Book Methods
 *
 * @packageDocumentation
 */

import {urn_util, urn_exception} from 'uranio-utils';

const urn_exc = urn_exception.init('BOOK_METHODS_MODULE', `Book methods module`);

import {schema} from '../sch/client';

import {atom_book} from '../atom_book';

import {Book} from '../typ/book_cln';

import {atom_hard_properties, atom_common_properties} from '../stc/client';

export function add_definition(
	atom_name: string,
	atom_definition: Book.Definition
):Book{
	const atom_book = get_all_definitions() as Book;
	atom_book[atom_name] = atom_definition;
	return atom_book;
}

export function get_names():schema.AtomName[]{
	return Object.keys(atom_book) as schema.AtomName[];
}

export function validate_name(atom_name:string):atom_name is schema.AtomName{
	return urn_util.object.has_key(atom_book, atom_name);
}

export function validate_auth_name(auth_name:string):auth_name is schema.AuthName{
	if(!validate_name(auth_name)){
		return false;
	}
	const atom_def = get_definition(auth_name as schema.AtomName);
	return atom_def.authenticate === true;
}

export function get_plural(atom_name:schema.AtomName):string{
	const atom_def = get_definition(atom_name);
	if(typeof atom_def.plural === 'string' && atom_def.plural !== ''){
		return atom_def.plural;
	}
	return `${atom_name}s`;
}

export function get_all_definitions():Book{
	return atom_book as unknown as Book;
}

export function get_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition{
	const atom_def = (atom_book as Book)[atom_name];
	if(!atom_def){
		throw urn_exc.create(
			'INVALID_ATOM_NAME',
			`Definition for Atom \`${atom_name}\` not found.`
		);
	}
	return (atom_book as Book)[atom_name] as unknown as Book.Definition;
}

export function get_property_definition<A extends schema.AtomName>(
	atom_name:A,
	property_name:keyof Book.Definition.Properties
):Book.Definition.Property{
	const all_prop_def = get_properties_definition(atom_name);
	if(!urn_util.object.has_key(all_prop_def, property_name)){
		throw urn_exc.create(
			'INVALID_PROPERTY_NAME',
			`Definition for \`${property_name}\` for Atom \`${atom_name}\` not found.`
		);
	}
	return all_prop_def[property_name];
}

export function get_custom_properties_definition<A extends schema.AtomName>(
	atom_name:A
):Book.Definition.Properties{
	const atom_def = (atom_book as Book)[atom_name] as unknown as Book.Definition;
	return atom_def.properties as Book.Definition.Properties;
}

export function get_properties_definition<A extends schema.AtomName>(
	atom_name:A
):Book.Definition.Properties{
	const custom_defs = get_custom_properties_definition(atom_name);
	const prop_defs = {
		...atom_hard_properties,
		...atom_common_properties,
		...custom_defs
	};
	return prop_defs;
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string)
		:boolean{
	if(urn_util.object.has_key(atom_hard_properties, key)){
		return true;
	}
	if(urn_util.object.has_key(atom_common_properties, key)){
		return true;
	}
	if(urn_util.object.has_key((atom_book as Book)[atom_name]['properties'], key)){
		return true;
	}
	return false;
}

