/**
 * Register module
 *
 * @packageDocumentation
 */

import path from 'path';

import caller from 'caller';

import * as book from '../book/';

import * as types from '../types';

export function register(atom_definition:types.Book.Definition)
		:types.Book.Definition{
	const caller_path = caller();
	const dirname = path.dirname(caller_path);
	const atom_dir_name = dirname.split('/').slice(-1)[0];
	book.add_definition(atom_dir_name, atom_definition);
	return atom_definition;
}

