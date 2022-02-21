/**
 * Register module
 *
 * @packageDocumentation
 */

import path from 'path';

import caller from 'caller';

import {urn_log} from 'urn-lib';

import * as book from '../book/client';

import * as types from '../cln/types';

import {schema} from '../sch/index';

export function register<A extends schema.AtomName>(atom_definition:types.Book.Definition, atom_name?:A)
		:string{
	let final_atom_name = `undefined_atom`;
	if(atom_name){
		final_atom_name = atom_name;
	}else{
		const caller_path = caller();
		const dirname = path.dirname(caller_path);
		final_atom_name =
			dirname.split('/').slice(-1)[0].replace('.','_').replace('-','_');
	}
	urn_log.debug(`Registering atom [${final_atom_name}]...`);
	book.add_definition(final_atom_name as A, atom_definition);
	urn_log.debug(`Atom [${final_atom_name}] registered.`);
	return final_atom_name;
}

