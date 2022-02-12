/**
 * Module for Server schema.Atom Book Methods
 *
 * @packageDocumentation
 */

import {Book} from '../typ/book_srv';

// import schema from 'uranio-schema';

import {schema} from '../sch/index';

import {atom_book} from '../base';

import * as common from './common';

export function add_definition(atom_name:string, atom_definition:Book.Definition)
		:Book{
	const atom_book_def:Book = {};
	atom_book_def[atom_name] = atom_definition;
	Object.assign(atom_book, {...atom_book_def, ...atom_book});
	return atom_book;
}

export function get_names():schema.AtomName[]{
	return Object.keys(atom_book) as schema.AtomName[];
}

export function validate_name(atom_name:string):boolean{
	return common.validate_name(atom_name);
}

export function get_all_definitions():Book{
	return atom_book as unknown as Book;
}

export function get_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition{
	return common.get_definition(atom_name);
}

export function get_property_definition<A extends schema.AtomName>(
	atom_name:A,
	property_name:keyof Book.Definition.Properties
):Book.Definition.Property{
	return common.get_property_definition(atom_name, property_name);
}

export function get_custom_property_definitions<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return common.get_custom_property_definitions(atom_name);
}
export function get_all_property_definitions<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return common.get_all_property_definitions(atom_name);
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string)
		:boolean{
	return common.has_property(atom_name, key);
}
