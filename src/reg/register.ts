/**
 * Register module
 *
 * @packageDocumentation
 */

import path from 'path';

import caller from 'caller';

import {urn_log} from 'urn-lib';

import * as book from '../book/';

import * as types from '../types';

export function register(atom_definition:types.Book.Definition, atom_name?: 'string')
		:types.Book.Definition{
	let final_atom_name = `undefined_atom`;
	if(!atom_name){
		const caller_path = caller();
		console.log(caller_path);
		const dirname = path.dirname(caller_path);
		final_atom_name =
			dirname.split('/').slice(-1)[0].replace('.','_').replace('-','_');
	}
	urn_log.debug(`Registering atom [${final_atom_name}]...`);
	book.add_definition(final_atom_name, atom_definition);
	urn_log.debug(`Atom [${final_atom_name}] registered.`);
	return atom_definition;
}

