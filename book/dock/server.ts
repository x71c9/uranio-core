/**
 * Module for Server Dock Book Methods
 *
 * @packageDocumentation
 */

import {AtomName} from '../../typ/atom';

import {Book} from '../../typ/book_srv';

import * as common from './common';

export function get_definition<A extends AtomName>(atom_name:A)
		:Book.Definition.Dock{
	return common.get_definition(atom_name);
}

