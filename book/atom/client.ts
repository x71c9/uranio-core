/**
 * Module for Client Book Methods
 *
 * @packageDocumentation
 */

import {AtomName} from '../../typ/atom';

import {atom_book} from 'uranio-books/atom';

export * from './common';

export function get_names():AtomName[]{
	return Object.keys(atom_book) as AtomName[];
}

