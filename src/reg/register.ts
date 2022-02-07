/**
 * Register module
 *
 * @packageDocumentation
 */

// import path from 'path';

// import caller from 'caller';

// import {urn_log} from 'urn-lib';

import * as book from '../book/';

import * as types from '../types';

export function register(atom_name: 'string', atom_definition:types.Book.Definition)
		:types.Book.Definition{
	// const caller_path = caller();
	// urn_log.debug(`Register Caller: ${caller_path}`);
	// const dirname = path.dirname(caller_path);
	// const atom_dir_name = dirname.split('/').slice(-1)[0];
	// book.add_definition(atom_dir_name, atom_definition);
	book.add_definition(atom_name, atom_definition);
	return atom_definition;
}

