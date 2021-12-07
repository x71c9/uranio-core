/**
 * Module for Server Dock Book Methods
 *
 * @packageDocumentation
 */

import {AtomName} from '../../typ/atom';

import {Book} from '../../typ/book_srv';

import {bll_book} from 'uranio-books/bll';

export function get_definition<A extends AtomName>(atom_name:A)
		:Book.Definition.Bll<A> | undefined{
	return (bll_book[atom_name] as Book.Definition<A>).bll;
}

