/**
 * Module for Server Atom Book Methods
 *
 * @packageDocumentation
 */

import {AtomName} from '../../typ/atom';

import {Book} from '../../typ/book_srv';

import {atom_book} from 'uranio-books/atom';

import * as common from './common';

export function get_names():AtomName[]{
	return Object.keys(atom_book) as AtomName[];
}

export function validate_name(atom_name:string):boolean{
	return common.validate_name(atom_name);
}

export function get_definition<A extends AtomName>(atom_name:A)
		:Book.BasicDefinition{
	return common.get_definition(atom_name);
}

export function get_property_definition<A extends AtomName>(atom_name:A, property_name:keyof Book.Definition.Properties)
		:Book.Definition.Property{
	return common.get_property_definition(atom_name, property_name);
}

export function get_custom_property_definitions<A extends AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return common.get_custom_property_definitions(atom_name);
}
export function get_all_property_definitions<A extends AtomName>(atom_name:A)
		:Book.Definition.Properties{
	return common.get_all_property_definitions(atom_name);
}

export function has_property<A extends AtomName>(atom_name:A, key:string)
		:boolean{
	return common.has_property(atom_name, key);
}
