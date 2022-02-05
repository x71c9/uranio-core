/**
 * Module for Client Book Methods
 *
 * @packageDocumentation
 */

// import schema from 'uranio-schema';

import {schema} from '../sch/';

// import {schema.AtomName} from '../../cln/types';

import {atom_book} from '../book';

export * from './common';

export function get_names():schema.AtomName[]{
	return Object.keys(atom_book) as schema.AtomName[];
}

