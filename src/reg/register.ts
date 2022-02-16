/**
 * Register module
 *
 * @packageDocumentation
 */

import path from 'path';

import caller from 'caller';

import {urn_log} from 'urn-lib';

import * as book from '../book/index';

import * as types from '../types';

import {schema} from '../sch/index';

export function register<A extends schema.AtomName>(atom_definition:types.Book.Definition<A>, atom_name?:string)
		:string{
	let final_atom_name = `undefined_atom`;
	if(atom_name){
		final_atom_name = atom_name;
	}else{
		const caller_path = caller();
		// console.log(caller_path);
		const dirname = path.dirname(caller_path);
		final_atom_name =
			dirname.split('/').slice(-1)[0].replace('.','_').replace('-','_');
	}
	urn_log.debug(`Registering atom [${final_atom_name}]...`);
	book.add_definition(final_atom_name as A, atom_definition);
	urn_log.debug(`Atom [${final_atom_name}] registered.`);
	return final_atom_name;
}

