/**
 * Register module
 *
 * @packageDocumentation
 */

// import path from 'path';

// import caller from 'caller';

// import {urn_log} from 'urn-lib';

// import * as book from '../book/server';

import * as types from '../server/types';

import {schema} from '../sch/server';

import {register as client_register} from './client';

export function register<A extends schema.AtomName>(
	atom_definition:types.Book.Definition<A>,
	atom_name?:A
):string{
	return client_register(atom_definition, atom_name);
}

