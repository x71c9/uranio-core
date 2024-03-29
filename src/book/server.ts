/**
 * Module for Server Book Methods
 *
 * @packageDocumentation
 */

import {Book as ClientBook} from '../typ/book_cln';

import {Book} from '../typ/book';

import {schema} from '../sch/server';

import {atom_book} from '../atom_book';

import * as client_book from './client';

export function add_definition(
	atom_name: string,
	atom_definition: ClientBook.Definition
):ClientBook{
	return client_book.add_definition(atom_name, atom_definition);
}

export function add_bll_definition<A extends schema.AtomName>(
	atom_name:A,
	bll_definition:Book.Definition.Bll<A>
):Book{
	const atom_book = get_all_definitions() as Book;
	const atom_def = get_definition(atom_name);
	atom_def.bll = bll_definition;
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

export function validate_auth_name(atom_name:string):boolean{
	return client_book.validate_auth_name(atom_name);
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

export function get_custom_properties_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return client_book.get_custom_properties_definition(atom_name);
}

export function get_properties_definition<A extends schema.AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return client_book.get_properties_definition(atom_name);
}

export function has_property<A extends schema.AtomName>(atom_name:A, key:string)
		:boolean{
	return client_book.has_property(atom_name, key);
}
