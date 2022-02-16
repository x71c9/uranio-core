/**
 * Module for Server Book Methods
 *
 * @packageDocumentation
 */

import {Book} from '../typ/book_srv';

import {schema} from '../sch/index';

import {atom_book} from '../atoms';

import * as client_book from './client';

export function add_definition<A extends schema.AtomName>(
	atom_name:A, atom_definition:Book.Definition<A>
):Book{
	const atom_book_def = {} as Book;
	atom_book_def[atom_name] = atom_definition;
	Object.assign(atom_book, {...atom_book_def, ...atom_book});
	return atom_book;
}

export function get_plural(atom_name:schema.AtomName):string{
	return client_book.get_plural(atom_name);
}

export function get_names():schema.AtomName[]{
	return client_book.get_names();
}

export function validate_name(atom_name:string):boolean{
	return client_book.validate_name(atom_name);
}

export function get_all_definitions():Book{
	return atom_book as unknown as Book;
}

export function get_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition<A>{
	return client_book.get_definition(atom_name);
}

export function get_property_definition<A extends schema.AtomName>(
	atom_name:A,
	property_name:keyof Book.Definition.Properties
):Book.Definition.Property{
	return client_book.get_property_definition(atom_name, property_name);
}

export function get_custom_property_definitions<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return client_book.get_custom_property_definitions(atom_name);
}
export function get_full_properties_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return client_book.get_full_properties_definition(atom_name);
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string)
		:boolean{
	return client_book.has_property(atom_name, key);
}
