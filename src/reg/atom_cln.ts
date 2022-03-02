/**
 * Register module
 *
 * @packageDocumentation
 */

import path from 'path';

import caller from 'caller';

import {urn_log} from 'urn-lib';

import * as book from '../book/client';

import * as types from '../client/types';

export function atom(
	atom_definition: types.Book.Definition,
	atom_name?: string
):string{
	const final_atom_name = _get_atom_name(atom_name);
	book.add_definition(final_atom_name, atom_definition);
	urn_log.debug(`Client atom [${final_atom_name}] registered.`);
	return final_atom_name;
}

function _get_atom_name(atom_name?:string){
	let final_atom_name = `undefined_atom`;
	if(atom_name){
		final_atom_name = atom_name;
	}else{
		const caller_path = caller();
		const dirname = path.dirname(caller_path);
		final_atom_name =
			dirname.split('/').slice(-1)[0].replace('.','_').replace('-','_');
	}
	return final_atom_name;
}

